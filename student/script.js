document.addEventListener('DOMContentLoaded', function() {
  // Initialize data
  const students = JSON.parse(localStorage.getItem('students')) || [];
  const attendance = JSON.parse(localStorage.getItem('attendance')) || [];
  const grades = JSON.parse(localStorage.getItem('grades')) || [];
  const messages = JSON.parse(localStorage.getItem('messages')) || [];
  const activityLog = JSON.parse(localStorage.getItem('activityLog')) || [];

  // DOM Elements
  const navLinks = document.querySelectorAll('nav a');
  const contentSections = document.querySelectorAll('.content-section');
  const modals = document.querySelectorAll('.modal');
  const closeButtons = document.querySelectorAll('.close-btn');
  
  // Initialize the app
  initNavigation();
  initModals();
  loadDashboard();
  loadStudents();
  loadAttendance();
  loadGrades();
  loadMessages();

  // Navigation functions
  function initNavigation() {
      navLinks.forEach(link => {
          link.addEventListener('click', function(e) {
              e.preventDefault();
              const sectionId = this.getAttribute('data-section');
              
              // Update active nav link
              navLinks.forEach(navLink => navLink.classList.remove('active'));
              this.classList.add('active');
              
              // Show corresponding section
              contentSections.forEach(section => {
                  section.classList.remove('active');
                  if (section.id === sectionId) {
                      section.classList.add('active');
                      
                      // Refresh section data when clicked
                      switch(sectionId) {
                          case 'dashboard':
                              loadDashboard();
                              break;
                          case 'students':
                              loadStudents();
                              break;
                          case 'attendance':
                              loadAttendance();
                              break;
                          case 'grades':
                              loadGrades();
                              break;
                          case 'messages':
                              loadMessages();
                              break;
                      }
                  }
              });
          });
      });
  }

  // Modal functions
  function initModals() {
      // Close modals when clicking X
      closeButtons.forEach(button => {
          button.addEventListener('click', () => {
              modals.forEach(modal => modal.style.display = 'none');
          });
      });

      // Close modals when clicking outside
      window.addEventListener('click', (e) => {
          if (e.target.classList.contains('modal')) {
              e.target.style.display = 'none';
          }
      });

      // Add Student button
      document.getElementById('add-student-btn').addEventListener('click', () => {
          document.getElementById('student-modal').style.display = 'flex';
          document.getElementById('student-form').reset();
          document.getElementById('student-id').value = '';
      });

      // Add Grade button
      document.getElementById('add-grade-btn').addEventListener('click', () => {
          document.getElementById('grade-modal').style.display = 'flex';
          document.getElementById('grade-form').reset();
          populateStudentSelect('grade-student');
      });

      // New Message button
      document.getElementById('new-message-btn').addEventListener('click', () => {
          document.getElementById('message-modal').style.display = 'flex';
          document.getElementById('message-form').reset();
          populateStudentSelect('message-recipient');
      });

      // Form submissions
      document.getElementById('student-form').addEventListener('submit', handleStudentForm);
      document.getElementById('grade-form').addEventListener('submit', handleGradeForm);
      document.getElementById('message-form').addEventListener('submit', handleMessageForm);
  }

  // Dashboard functions
  function loadDashboard() {
      // Total students
      document.getElementById('total-students').textContent = students.length;

      // Today's attendance
      const today = new Date().toISOString().split('T')[0];
      const todayAttendance = attendance.filter(a => a.date === today);
      const presentCount = todayAttendance.filter(a => a.status === 'Present').length;
      const attendancePercentage = todayAttendance.length > 0 ? 
          Math.round((presentCount / todayAttendance.length) * 100) : 0;
      document.getElementById('attendance-today').textContent = `${attendancePercentage}%`;

      // Average grade
      const gradeSum = grades.reduce((sum, grade) => sum + grade.grade, 0);
      const averageGrade = grades.length > 0 ? (gradeSum / grades.length).toFixed(1) : '0.0';
      document.getElementById('average-grade').textContent = averageGrade;

      // New messages
      const unreadMessages = messages.filter(m => !m.read).length;
      document.getElementById('new-messages').textContent = unreadMessages;

      // Recent activity
      const activityList = document.getElementById('activity-list');
      activityList.innerHTML = '';
      activityLog.slice().reverse().forEach(activity => {
          const li = document.createElement('li');
          li.innerHTML = `
              <i class="fas fa-circle"></i>
              <div>
                  <strong>${activity.action}</strong>
                  <p>${activity.details}</p>
                  <small>${activity.timestamp}</small>
              </div>
          `;
          activityList.appendChild(li);
      });
  }

  // Student functions
  function loadStudents() {
      const tableBody = document.getElementById('students-table').querySelector('tbody');
      tableBody.innerHTML = '';

      students.forEach(student => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
              <td>${student.id}</td>
              <td>${student.firstName} ${student.lastName}</td>
              <td>${student.email}</td>
              <td>${student.phone}</td>
              <td>${student.gradeLevel}</td>
              <td class="actions">
                  <button class="btn btn-primary edit-student" data-id="${student.id}">
                      <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn btn-danger delete-student" data-id="${student.id}">
                      <i class="fas fa-trash"></i>
                  </button>
              </td>
          `;
          tableBody.appendChild(tr);
      });

      // Add event listeners
      document.querySelectorAll('.edit-student').forEach(btn => {
          btn.addEventListener('click', (e) => editStudent(e.target.closest('button').dataset.id));
      });

      document.querySelectorAll('.delete-student').forEach(btn => {
          btn.addEventListener('click', (e) => deleteStudent(e.target.closest('button').dataset.id));
      });
  }

  function handleStudentForm(e) {
      e.preventDefault();
      const form = e.target;
      const studentId = form.querySelector('#student-id').value;
      const studentData = {
          firstName: form.querySelector('#first-name').value,
          lastName: form.querySelector('#last-name').value,
          email: form.querySelector('#email').value,
          phone: form.querySelector('#phone').value,
          gradeLevel: form.querySelector('#grade-level').value,
          address: form.querySelector('#address').value
      };

      if (studentId) {
          // Update existing student
          const index = students.findIndex(s => s.id == studentId);
          students[index] = { ...students[index], ...studentData };
          addActivity('Student updated', `${studentData.firstName} ${studentData.lastName} was updated`);
      } else {
          // Add new student
          const newId = students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1;
          students.push({ id: newId, ...studentData });
          addActivity('New student added', `${studentData.firstName} ${studentData.lastName} was added`);
      }

      saveData();
      document.getElementById('student-modal').style.display = 'none';
      loadStudents();
      loadDashboard();
  }

  function editStudent(id) {
      const student = students.find(s => s.id == id);
      if (!student) return;

      const form = document.getElementById('student-form');
      form.querySelector('#student-id').value = student.id;
      form.querySelector('#first-name').value = student.firstName;
      form.querySelector('#last-name').value = student.lastName;
      form.querySelector('#email').value = student.email;
      form.querySelector('#phone').value = student.phone;
      form.querySelector('#grade-level').value = student.gradeLevel;
      form.querySelector('#address').value = student.address || '';

      document.getElementById('student-modal').style.display = 'flex';
  }

  function deleteStudent(id) {
      if (confirm('Are you sure you want to delete this student?')) {
          const index = students.findIndex(s => s.id == id);
          if (index !== -1) {
              const student = students[index];
              students.splice(index, 1);
              addActivity('Student deleted', `${student.firstName} ${student.lastName} was removed`);
              saveData();
              loadStudents();
              loadDashboard();
          }
      }
  }

  // Attendance functions
  function loadAttendance() {
      const tableBody = document.getElementById('attendance-table').querySelector('tbody');
      tableBody.innerHTML = '';
      const selectedDate = document.getElementById('attendance-date').value || new Date().toISOString().split('T')[0];

      const filteredAttendance = attendance.filter(a => a.date === selectedDate);
      
      if (filteredAttendance.length === 0 && students.length > 0) {
          // No attendance for this date, show all students as "Not Marked"
          students.forEach(student => {
              const tr = document.createElement('tr');
              tr.innerHTML = `
                  <td>${student.id}</td>
                  <td>${student.firstName} ${student.lastName}</td>
                  <td>Not Marked</td>
                  <td>${selectedDate}</td>
                  <td class="actions">
                      <button class="btn btn-primary mark-present" data-id="${student.id}">Present</button>
                      <button class="btn btn-warning mark-absent" data-id="${student.id}">Absent</button>
                  </td>
              `;
              tableBody.appendChild(tr);
          });
      } else {
          // Show existing attendance records
          filteredAttendance.forEach(record => {
              const student = students.find(s => s.id == record.studentId);
              if (!student) return;

              const tr = document.createElement('tr');
              tr.innerHTML = `
                  <td>${student.id}</td>
                  <td>${student.firstName} ${student.lastName}</td>
                  <td>${record.status}</td>
                  <td>${record.date}</td>
                  <td class="actions">
                      <button class="btn btn-primary mark-present" data-id="${student.id}">Present</button>
                      <button class="btn btn-warning mark-absent" data-id="${student.id}">Absent</button>
                  </td>
              `;
              tableBody.appendChild(tr);
          });
      }

      // Add event listeners
      document.querySelectorAll('.mark-present').forEach(btn => {
          btn.addEventListener('click', (e) => markAttendance(e.target.closest('button').dataset.id, 'Present'));
      });

      document.querySelectorAll('.mark-absent').forEach(btn => {
          btn.addEventListener('click', (e) => markAttendance(e.target.closest('button').dataset.id, 'Absent'));
      });

      updateAttendanceSummary(selectedDate);
  }

  function markAttendance(studentId, status) {
      const date = document.getElementById('attendance-date').value || new Date().toISOString().split('T')[0];
      const existingIndex = attendance.findIndex(a => a.studentId == studentId && a.date === date);

      const student = students.find(s => s.id == studentId);
      if (!student) return;

      if (existingIndex !== -1) {
          attendance[existingIndex].status = status;
      } else {
          const newId = attendance.length > 0 ? Math.max(...attendance.map(a => a.id)) + 1 : 1;
          attendance.push({
              id: newId,
              studentId: parseInt(studentId),
              studentName: `${student.firstName} ${student.lastName}`,
              date,
              status
          });
      }

      addActivity('Attendance marked', `${student.firstName} ${student.lastName} marked as ${status}`);
      saveData();
      loadAttendance();
      loadDashboard();
  }

  function updateAttendanceSummary(date) {
      const filteredAttendance = attendance.filter(a => a.date === date);
      const presentCount = filteredAttendance.filter(a => a.status === 'Present').length;
      const percentage = filteredAttendance.length > 0 ? 
          Math.round((presentCount / filteredAttendance.length) * 100) : 0;

      document.getElementById('attendance-percentage').textContent = `${percentage}%`;
      document.getElementById('attendance-progress').style.width = `${percentage}%`;
  }

  // Grade functions
  function loadGrades() {
      const tableBody = document.getElementById('grades-table').querySelector('tbody');
      tableBody.innerHTML = '';
      const studentFilter = document.getElementById('grade-student-filter').value;
      const subjectFilter = document.getElementById('grade-subject-filter').value;

      let filteredGrades = [...grades];
      if (studentFilter) filteredGrades = filteredGrades.filter(g => g.studentId == studentFilter);
      if (subjectFilter) filteredGrades = filteredGrades.filter(g => g.subject === subjectFilter);

      filteredGrades.forEach(grade => {
          const student = students.find(s => s.id == grade.studentId);
          if (!student) return;

          const tr = document.createElement('tr');
          tr.innerHTML = `
              <td>${student.id}</td>
              <td>${student.firstName} ${student.lastName}</td>
              <td>${grade.subject}</td>
              <td>${grade.grade}</td>
              <td>${grade.date}</td>
              <td class="actions">
                  <button class="btn btn-danger delete-grade" data-id="${grade.id}">
                      <i class="fas fa-trash"></i>
                  </button>
              </td>
          `;
          tableBody.appendChild(tr);
      });

      // Add event listeners
      document.querySelectorAll('.delete-grade').forEach(btn => {
          btn.addEventListener('click', (e) => deleteGrade(e.target.closest('button').dataset.id));
      });
  }

  function handleGradeForm(e) {
      e.preventDefault();
      const form = e.target;
      const gradeData = {
          studentId: parseInt(form.querySelector('#grade-student').value),
          subject: form.querySelector('#grade-subject').value,
          grade: parseFloat(form.querySelector('#grade-value').value),
          date: form.querySelector('#grade-date').value,
          notes: form.querySelector('#grade-notes').value
      };

      const student = students.find(s => s.id == gradeData.studentId);
      if (!student) return;

      const newId = grades.length > 0 ? Math.max(...grades.map(g => g.id)) + 1 : 1;
      grades.push({
          id: newId,
          studentName: `${student.firstName} ${student.lastName}`,
          ...gradeData
      });

      addActivity('Grade added', `New grade for ${student.firstName} ${student.lastName} in ${gradeData.subject}`);
      saveData();
      document.getElementById('grade-modal').style.display = 'none';
      loadGrades();
      loadDashboard();
  }

  function deleteGrade(id) {
      if (confirm('Are you sure you want to delete this grade?')) {
          const index = grades.findIndex(g => g.id == id);
          if (index !== -1) {
              const grade = grades[index];
              grades.splice(index, 1);
              addActivity('Grade deleted', `Grade for ${grade.studentName} in ${grade.subject} was removed`);
              saveData();
              loadGrades();
          }
      }
  }

  // Message functions
  function loadMessages() {
      const messageThreads = document.getElementById('message-threads');
      messageThreads.innerHTML = '';

      messages.forEach(message => {
          const li = document.createElement('li');
          li.className = message.read ? '' : 'unread';
          li.dataset.id = message.id;
          li.innerHTML = `
              <strong>${message.senderName}</strong>
              <p>${message.subject}</p>
              <small>${message.date}</small>
          `;
          messageThreads.appendChild(li);
      });

      // Add event listeners
      document.querySelectorAll('#message-threads li').forEach(li => {
          li.addEventListener('click', () => viewMessage(li.dataset.id));
      });
  }

  function handleMessageForm(e) {
      e.preventDefault();
      const form = e.target;
      const messageData = {
          senderId: 0, // Assuming 0 is the teacher/admin
          senderName: 'Teacher',
          recipientId: parseInt(form.querySelector('#message-recipient').value),
          subject: form.querySelector('#message-subject-input').value,
          content: form.querySelector('#message-content').value,
          date: new Date().toISOString().split('T')[0],
          read: false
      };

      const student = students.find(s => s.id == messageData.recipientId);
      if (!student) return;

      const newId = messages.length > 0 ? Math.max(...messages.map(m => m.id)) + 1 : 1;
      messages.push({
          id: newId,
          recipientName: `${student.firstName} ${student.lastName}`,
          ...messageData
      });

      addActivity('Message sent', `New message to ${student.firstName} ${student.lastName}`);
      saveData();
      document.getElementById('message-modal').style.display = 'none';
      loadMessages();
      loadDashboard();
  }

  function viewMessage(id) {
      const message = messages.find(m => m.id == id);
      if (!message) return;

      // Mark as read
      message.read = true;
      saveData();

      // Display message
      document.getElementById('message-subject').textContent = message.subject;
      document.getElementById('message-sender').textContent = `From: ${message.senderName}`;
      document.getElementById('message-date').textContent = message.date;
      document.getElementById('message-body').innerHTML = `<p>${message.content}</p>`;
  }

  // Utility functions
  function populateStudentSelect(selectId) {
      const select = document.getElementById(selectId);
      select.innerHTML = '<option value="">Select Student</option>';
      
      students.forEach(student => {
          const option = document.createElement('option');
          option.value = student.id;
          option.textContent = `${student.firstName} ${student.lastName}`;
          select.appendChild(option);
      });
  }

  function addActivity(action, details) {
      const timestamp = new Date().toLocaleString();
      activityLog.push({
          id: activityLog.length + 1,
          action,
          details,
          timestamp
      });
      saveData();
  }

  function saveData() {
      localStorage.setItem('students', JSON.stringify(students));
      localStorage.setItem('attendance', JSON.stringify(attendance));
      localStorage.setItem('grades', JSON.stringify(grades));
      localStorage.setItem('messages', JSON.stringify(messages));
      localStorage.setItem('activityLog', JSON.stringify(activityLog));
  }

  // Initialize student filter dropdown
  function initGradeStudentFilter() {
      const select = document.getElementById('grade-student-filter');
      select.innerHTML = '<option value="">All Students</option>';
      
      students.forEach(student => {
          const option = document.createElement('option');
          option.value = student.id;
          option.textContent = `${student.firstName} ${student.lastName}`;
          select.appendChild(option);
      });

      select.addEventListener('change', loadGrades);
  }

  // Initialize on page load
  initGradeStudentFilter();
  document.getElementById('grade-subject-filter').addEventListener('change', loadGrades);
  document.getElementById('attendance-date').addEventListener('change', loadAttendance);
});