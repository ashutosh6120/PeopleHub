const Employee = require('../models/Employee.js');

exports.getAllEmployees = async (req, res, next) => {
    try {
        const { search, page = 1, limit = 10 } = req.query;

        let query = { isActive: true };

        // search filter
        if(search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i'} },
                { phone: { $regex: search, $options: 'i'} },
            ];
        }

        const skip = (page - 1) * limit;
        const employees = await Employee.find(query)
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await Employee.countDocuments(query);

        res.json({
            employees,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        next(error);
    }
};


exports.getEmployeeById = async (req, res, next) => {
    try {
        const employee = await Employee.findById(req.params.id).populate('user');
        if(!employee) {
            return res.status(404).json({ error: 'employee not found' });
        }
        res.json(employee);
    } catch (error) {
        next(error);
    }
};

exports.createEmployee = async (req, res, next) => {
    try {
        const { name, email, phone, department, position, joiningDate } = req.body;

        // validate required fields
        if(!name || !email || !phone || !department || !position || !joiningDate) {
            return res.status(400).json({ error: 'all fields are required' });
        }

        // check if employee exists
        const existingEmployee = await Employee.findOne({ email });
        if(existingEmployee) {
            return res.status(400).json({ error: 'employee with this email already exists' });
        }

        const employee = new Employee({
            name,
            email,
            phone,
            department,
            position,
            joiningDate
        });

        await employee.save();

        res.status(201).json({
            message: 'employee created successfully',
            employee
        });
    } catch (error) {
        next(error);
    }
};

exports.updateEmployee = async (req, res, next) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if(!employee) {
            return res.status(404).json({ error: 'employee not found' });
        }

        // update fields
        const { name, email, phone, department, position, joiningDate, isActive } = req.body;
        if(name) employee.name = name;
        if(email) employee.email = email;
        if(phone) employee.phone = phone;
        if(department) employee.department = department;
        if(position) employee.position = position;
        if(joiningDate) employee.joiningDate = joiningDate;
        if(typeof isActive === 'boolean') employee.isActive = isActive;

        employee.updatedAt = Date.now();
        await employee.save();

        res.json({
            message: 'employee updated successfully',
            employee
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteEmployee = async (req, res, next) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);
        if(!employee) {
            return res.status(404).json({ error: 'employee not found' });
        }

        res.json({
            message: 'employee deleted successfully',
            employee
        });
    } catch (error) {
        next(error);
    }
};