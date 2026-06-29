const Leave = require("../models/Leave.js");
const Employee = require("../models/Employee.js");
const mongoose = require("mongoose");

exports.getLeaves = async (req, res, next) => {
  try {
    const { employeeId, employee_id, status, page = 1, limit = 10 } = req.query;
    const employeeFilter = employee_id || employeeId;

    let query = {};

    // Filter by employee
    if (employeeFilter) {
      query.employee = employeeFilter;
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Admin can see all, employee can only see their own
    if (req.user.role === "employee") {
      // Find employee record for this user
      const employee = await Employee.findOne({ user: req.user.id });
      if (employee) {
        query.employee = employee._id;
      } else {
        query.employee = null;
      }
    }

    const skip = (page - 1) * limit;
    const leaves = await Leave.find(query)
      .populate("employee", "name email department")
      .populate("approvedBy", "name email")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Leave.countDocuments(query);

    res.json({
      leaves,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.applyLeave = async (req, res, next) => {
  try {
    const { leaveType, startDate, endDate, numberOfDays, reason } = req.body;
    let targetEmployeeId;

    if (req.user?.role === 'employee') {
      // Always resolve from the JWT token for employee users — never trust frontend-supplied id
      let employee = await Employee.findOne({ user: req.user.id });

      if (!employee) {
        // Auto-create a minimal employee record linked to this user account
        employee = new Employee({
          name: req.user.name || 'Unknown',
          email: req.user.email || `user_${req.user.id}@company.com`,
          phone: '0000000000',
          department: 'Engineering',
          position: 'Employee',
          joiningDate: new Date(),
          user: req.user.id,
        });
        await employee.save();
      }

      targetEmployeeId = employee._id;
    } else {
      // Admin submitting on behalf — use provided employeeId
      const { employeeId, employee_id } = req.body;
      targetEmployeeId = employee_id || employeeId;
    }

    // Validate required fields
    if (!targetEmployeeId || !leaveType || !startDate || !endDate || !numberOfDays || !reason) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if employee exists
    const employee = await Employee.findById(targetEmployeeId);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Validate dates
    if (new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({ error: 'Start date must be before end date' });
    }

    const leave = new Leave({
      employee: targetEmployeeId,
      leaveType,
      startDate,
      endDate,
      numberOfDays,
      reason,
      status: 'Pending'
    });

    await leave.save();

    res.status(201).json({
      message: 'Leave request submitted successfully',
      leave: await leave.populate('employee', 'name email')
    });
  } catch (error) {
    next(error);
  }
};

exports.updateLeaveStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    // Validate status
    if (!["Approved", "Rejected"].includes(status)) {
      return res
        .status(400)
        .json({ error: "Invalid status. Must be Approved or Rejected" });
    }

    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ error: "Leave request not found" });
    }

    leave.status = status;
    leave.approvedBy = req.user.id;
    leave.approvedDate = new Date();
    leave.updatedAt = Date.now();

    await leave.save();

    const populatedLeave = await leave.populate([
      { path: "employee", select: "name email" },
      { path: "approvedBy", select: "name" },
    ]);

    res.json({
      message: `Leave request ${status.toLowerCase()} successfully`,
      leave: populatedLeave,
    });
  } catch (error) {
    next(error);
  }
};

exports.getLeaveBalance = async (req, res, next) => {
  try {
    const employeeId = req.params.id;

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Get approved leave days by type
    const balances = await Leave.aggregate([
      {
        $match: {
          employee: new mongoose.Types.ObjectId(employeeId),
          status: "Approved",
        },
      },
      {
        $group: {
          _id: "$leaveType",
          totalDays: { $sum: "$numberOfDays" },
        },
      },
    ]);

    // Define leave entitlements
    const leaveEntitlements = {
      Sick: 10,
      Casual: 12,
      Earned: 20,
    };

    // Calculate remaining balance
    const balanceMap = {};
    for (const [type, entitlement] of Object.entries(leaveEntitlements)) {
      const used = balances.find((b) => b._id === type)?.totalDays || 0;
      balanceMap[type] = entitlement - used;
    }

    res.json({
      employee: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
      },
      balance: balanceMap,
      entitlements: leaveEntitlements,
    });
  } catch (error) {
    next(error);
  }
};
