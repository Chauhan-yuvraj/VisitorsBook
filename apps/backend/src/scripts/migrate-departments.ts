import mongoose from 'mongoose';
import { Department } from '../models/department.model';
import { connectDB } from '../config/db';

async function migrateEmployeeDepartments() {
  try {
    // Connect to MongoDB using the same config as the app
    await connectDB();

    console.log('Starting migration to clean up employee departments...');

    // Find all employees that have the old department field using raw MongoDB
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not available');
    }
    const employeesCollection = db.collection('employees');
    const rawEmployees = await employeesCollection.find({ department: { $exists: true } }).toArray();

    console.log(`Found ${rawEmployees.length} employees with old department field`);

    // Get all departments for lookup
    const departments = await Department.find({});
    const deptMap = new Map<string, string>();
    const nameToId = new Map<string, string>();
    departments.forEach(dept => {
      deptMap.set(dept.departmentName, dept._id.toString());
      nameToId.set(dept.departmentName.toLowerCase(), dept._id.toString());
      // Also map common abbreviations
      if (dept.departmentName === 'Information Technology') {
        deptMap.set('IT', dept._id.toString());
        nameToId.set('it', dept._id.toString());
      }
    });
    console.log('Department map:', Object.fromEntries(deptMap));

    for (const emp of rawEmployees) {
      console.log(`Employee ${emp.name}: department = ${JSON.stringify(emp.department)}, type = ${typeof emp.department}`);

      const update: any = {};

      let needsUpdate = false;

      // If there's a department string, find the ID and set departments
      if (emp.department && typeof emp.department === 'string') {
        const deptId = deptMap.get(emp.department);
        if (deptId) {
          // If departments array doesn't exist or is empty, set it
          if (!emp.departments || emp.departments.length === 0) {
            update.departments = [deptId];
          } else {
            // If already has departments, add if not present
            const currentIds = emp.departments.map((id: any) => id.toString());
            if (!currentIds.includes(deptId)) {
              update.departments = [...currentIds, deptId];
            }
          }
          needsUpdate = true;
        } else {
          console.log(`Department "${emp.department}" not found in department map`);
        }
      }

      // Remove old fields
      update.$unset = {
        department: 1,
        departmentId: 1 // Also remove departmentId if exists
      };
      needsUpdate = true;

      if (needsUpdate) {
        await employeesCollection.updateOne({ _id: emp._id }, update);
        console.log(`Updated employee: ${emp.name} - linked to department: ${emp.department}`);
      }
    }

    console.log('Migration completed successfully');

    // Verify that no employees have the old department field
    const remaining = await employeesCollection.find({ department: { $exists: true } }).toArray();
    console.log(`Verification: ${remaining.length} employees still have department field`);

    if (remaining.length > 0) {
      console.log('Remaining employees with department field:');
      remaining.forEach(emp => console.log(`- ${emp.name}: ${emp.department}`));
    }
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Run the migration
migrateEmployeeDepartments();