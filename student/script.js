document.addEventListener('DOMContentLoaded', function() {
  // Sample data for the application
  let students = [
      { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', phone: '123-456-7890', gradeLevel: 'Senior', address: '123 Main St' },
      { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', phone: '234-567-8901', gradeLevel: 'Junior', address: '456 Oak Ave' },
      { id: 3, firstName: 'Michael', lastName: 'Johnson', email: 'michael.j@example.com', phone: '345-678-9012', gradeLevel: 'Sophomore', address: '789 Pine Rd' }
  ];

  let attendance = [
      { id: 1, studentId: 1, name: 'John Doe', status: 'Present', date: '2023-05-01' },
      { id: 2, studentId: 2, name: 'Jane Smith', status: 'Present', date: '2023-05-01' },
      { id: 3, studentId: 3, name: 'Michael Johnson', status: 'Absent', date: '2023-05-01' },
      { id: 4, studentId: 1, name: 'John Doe', status: 'Present', date: '2023-05-02' },
      { id: 5, studentId: 2, name: 'Jane Smith', status: 'Late', date: '2023-05-02' }
  ];

  let grades = [
      { id: 1, studentId: 1, name: 'John Doe', subject: 'Math', grade: 95, date: '2023-04-15', notes: 'Excellent work' },
      { id: 2, studentId: 1, name: 'John Doe', subject: 'Science', grade: 88, date: '2023-04-18', notes: 'Good effort' },
      { id: 3, studentId: 2, name: 'Jane Smith', subject: 'English', grade: 92, date: '2023-04-16', notes: 'Well written essay' },
      { id: 4, studentId: 3, name: 'Michael Johnson', subject: 'History', grade: 78, date: '2023-04-17', notes: 'Needs improvement' }
  ];

  let messages = [
      { id: 1, senderId: 1, senderName: 'John Doe', recipientId: 0, subject: 'Question about assignment', content: 'I have a question about the homework due next week.', date: '2023-04-20', read: false },
      { id: 2, senderId: 2, senderName: 'Jane Smith', recipientId: 0, subject: 'Meeting request', content: 'Can we schedule a meeting to discuss my progress?', date: '2023-04-18', read: true },
      { id: 3, senderId: 3, senderName: 'Michael Johnson', recipientId: 0, subject: 'Grade inquiry', content: 'I would like to discuss my last test grade.', date: '2023-04-15', read: false }
  ];

  let activities = [
      { id: 1, type: 'grade', description: 'Added grade for John Doe in Math (95%)', date: '2023-04-15' },
      { id: 2, type: 'attendance', description: 'Marked attendance for 3 students', date: '2023-04-14' },
      { id: 3, type: 'student', description: 'Added new student Michael Johnson', date: '2023-04-10' },
      { id: 4, type: 'message', description: 'Received new message from Jane Smith', date: '2023-04-08' }
  ];

  // DOM elements
  const navLinks = document.querySelectorAll('nav a');
  const contentSections = document.querySelectorAll('.content-section');
  const studentModal = document.getElementById('student-modal');
  const gradeModal = document.getElementById('grade-modal');
  const messageModal = document.getElementById('message-modal');
  const closeButtons = document.querySelectorAll('.close-btn');
  const addStudentBtn = document.getElementById('add-student-btn');
  const addGradeBtn = document.getElementById('add-grade-btn');
  const newMessageBtn = document.getElementById('new-message-btn');
  const markAttendanceBtn = document.getElementById('mark-attendance-btn');
  const studentForm = document.getElementById('student-form');
  const gradeForm = document.getElementById('grade-form');
  const messageForm = document.getElementById('message-form');
  const studentSearch = document.getElementById('student-search');
  const attendanceDate = document.getElementById('attendance-date');
  const gradeStudentFilter = document.getElementById('grade-student-filter');
  const gradeSubjectFilter = document.getElementById('grade-subject-filter');
  const messageRecipient = document.getElementById('message-recipient');
  const gradeStudentSelect = document.getElementById('grade-student');
  const replyText = document.getElementById('reply-text');
  const sendReplyBtn = document.getElementById('send-reply-btn');

  // Set current date as default for attendance
  const today = new Date().toISOString().split('T')[0];
  attendanceDate.value = today;

  // Initialize the application
  init();

  // Event listeners
  navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
          e.preventDefault();
          const sectionId = this.getAttribute('data-section');
          showSection(sectionId);
      });
  });

  closeButtons.forEach(button => {
      button.addEventListener('click', function() {
          const modal = this.closest('.modal');
          modal.style.display = 'none';
      });
  });

  addStudentBtn.addEventListener('click', () => {
      openStudentModal();
  });

  addGradeBtn.addEventListener('click', () => {
      openGradeModal();
  });

  newMessageBtn.addEventListener('click', () => {
      openMessageModal();
  });

  markAttendanceBtn.addEventListener('click', () => {
      markAttendance();
  });

  studentForm.addEventListener('submit', handleStudentFormSubmit);
  gradeForm.addEventListener('submit', handleGradeFormSubmit);
  messageForm.addEventListener('submit', handleMessageFormSubmit);

  studentSearch.addEventListener('input', () => {
      filterStudents(studentSearch.value);
  });

  gradeStudentFilter.addEventListener('change', filterGrades);
  gradeSubjectFilter.addEventListener('change', filterGrades);

  sendReplyBtn.addEventListener('click', sendReply);

  // Click outside modal to close
  window.addEventListener('click', function(e) {
      if (e.target.classList.contains('modal')) {
          e.target.style.display = 'none';
      }
  });

  // Functions
  function init() {
      // Show dashboard by default
      showSection('dashboard');
      
      // Load all data
      renderStudentsTable();
      renderAttendanceTable();
      renderGradesTable();
      renderMessages();
      renderDashboardStats();
      renderRecentActivity();
      
      // Populate filters and selects
      populateStudentFilters();
  }

  function showSection(sectionId) {
      // Hide all sections
      contentSections.forEach(section => {
          section.classList.remove('active');
      });

      // Show the selected section
      document.getElementById(sectionId).classList.add('active');

      // Update active nav link
      navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('data-section') === sectionId) {
              link.classList.add('active');
          }
      });
  }

  function renderStudentsTable() {
      const tbody = document.querySelector('#students-table tbody');
      tbody.innerHTML = '';

      students.forEach(student => {
          const row = document.createElement('tr');
          row.innerHTML = `
              <td>${student.id}</td>
              <td>${student.firstName} ${student.lastName}</td>
              <td>${student.email}</td>
              <td>${student.phone}</td>
              <td>${student.gradeLevel}</td>
              <td class="actions">
                  <button class="btn btn-primary edit-student" data-id="${student.id}"><i class="fas fa-edit"></i></button>
                  <button class="btn btn-danger delete-student" data-id="${student.id}"><i class="fas fa-trash"></i></button>
              </td>
          `;
          tbody.appendChild(row);
      });

      // Add event listeners to edit and delete buttons
      document.querySelectorAll('.edit-student').forEach(button => {
          button.addEventListener('click', function() {
              const studentId = parseInt(this.getAttribute('data-id'));
              openStudentModal(studentId);
          });
      });

      document.querySelectorAll('.delete-student').forEach(button => {
          button.addEventListener('click', function() {
              const studentId = parseInt(this.getAttribute('data-id'));
              deleteStudent(studentId);
          });
      });
  }

  function renderAttendanceTable() {
      const tbody = document.querySelector('#attendance-table tbody');
      tbody.innerHTML = '';

      // Filter attendance for the selected date
      const filteredAttendance = attendance.filter(record => record.date === attendanceDate.value);

      filteredAttendance.forEach(record => {
          const row = document.createElement('tr');
          row.innerHTML = `
              <td>${record.studentId}</td>
              <td>${record.name}</td>
              <td><span class="status ${record.status.toLowerCase()}">${record.status}</span></td>
              <td>${formatDate(record.date)}</td>
              <td class="actions">
                  <button class="btn btn-warning edit-attendance" data-id="${record.id}"><i class="fas fa-edit"></i></button>
              </td>
          `;
          tbody.appendChild(row);
      });

      // Update attendance summary
      updateAttendanceSummary(filteredAttendance);

      // Add event listeners to edit buttons
      document.querySelectorAll('.edit-attendance').forEach(button => {
          button.addEventListener('click', function() {
              const attendanceId = parseInt(this.getAttribute('data-id'));
              editAttendance(attendanceId);
          });
      });
  }

  function renderGradesTable() {
      const tbody = document.querySelector('#grades-table tbody');
      tbody.innerHTML = '';

      // Apply filters
      let filteredGrades = [...grades];
      const studentFilter = gradeStudentFilter.value;
      const subjectFilter = gradeSubjectFilter.value;

      if (studentFilter) {
          filteredGrades = filteredGrades.filter(grade => grade.studentId === parseInt(studentFilter));
      }

      if (subjectFilter) {
          filteredGrades = filteredGrades.filter(grade => grade.subject === subjectFilter);
      }

      filteredGrades.forEach(grade => {
          const row = document.createElement('tr');
          row.innerHTML = `
              <td>${grade.studentId}</td>
              <td>${grade.name}</td>
              <td>${grade.subject}</td>
              <td>${grade.grade}</td>
              <td>${formatDate(grade.date)}</td>
              <td class="actions">
                  <button class="btn btn-primary edit-grade" data-id="${grade.id}"><i class="fas fa-edit"></i></button>
                  <button class="btn btn-danger delete-grade" data-id="${grade.id}"><i class="fas fa-trash"></i></button>
              </td>
          `;
          tbody.appendChild(row);
      });

      // Add event listeners to edit and delete buttons
      document.querySelectorAll('.edit-grade').forEach(button => {
          button.addEventListener('click', function() {
              const gradeId = parseInt(this.getAttribute('data-id'));
              openGradeModal(gradeId);
          });
      });

      document.querySelectorAll('.delete-grade').forEach(button => {
          button.addEventListener('click', function() {
              const gradeId = parseInt(this.getAttribute('data-id'));
              deleteGrade(gradeId);
          });
      });
  }

  function renderMessages() {
      const messageThreads = document.getElementById('message-threads');
      messageThreads.innerHTML = '';

      messages.forEach(message => {
          const li = document.createElement('li');
          li.className = message.read ? '' : 'unread';
          li.innerHTML = `
              <div class="message-preview">
                  <strong>${message.senderName}</strong>
                  <span>${message.subject}</span>
                  <small>${formatDate(message.date)}</small>
              </div>
          `;
          li.addEventListener('click', () => {
              viewMessage(message.id);
              // Mark as read
              message.read = true;
              li.classList.remove('unread');
          });
          messageThreads.appendChild(li);
      });
  }

  function renderDashboardStats() {
      document.getElementById('total-students').textContent = students.length;
      
      // Calculate today's attendance percentage
      const todayAttendance = attendance.filter(a => a.date === today);
      const presentCount = todayAttendance.filter(a => a.status === 'Present').length;
      const attendancePercentage = todayAttendance.length > 0 ? Math.round((presentCount / todayAttendance.length) * 100) : 0;
      document.getElementById('attendance-today').textContent = `${attendancePercentage}%`;
      
      // Calculate average grade
      const totalGrades = grades.reduce((sum, grade) => sum + grade.grade, 0);
      const averageGrade = grades.length > 0 ? (totalGrades / grades.length).toFixed(1) : 0;
      document.getElementById('average-grade').textContent = averageGrade;
      
      // Count unread messages
      const unreadMessages = messages.filter(m => !m.read).length;
      document.getElementById('new-messages').textContent = unreadMessages;
  }

  function renderRecentActivity() {
      const activityList = document.getElementById('activity-list');
      activityList.innerHTML = '';

      // Show last 5 activities
      const recentActivities = [...activities].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

      recentActivities.forEach(activity => {
          const li = document.createElement('li');
          li.innerHTML = `
              <i class="fas ${getActivityIcon(activity.type)}"></i>
              <div>
                  <p>${activity.description}</p>
                  <small>${formatDate(activity.date)}</small>
              </div>
          `;
          activityList.appendChild(li);
      });
  }

  function getActivityIcon(type) {
      switch(type) {
          case 'grade': return 'fa-chart-bar';
          case 'attendance': return 'fa-calendar-check';
          case 'student': return 'fa-user-plus';
          case 'message': return 'fa-envelope';
          default: return 'fa-info-circle';
      }
  }

  function populateStudentFilters() {
      // Clear existing options
      gradeStudentFilter.innerHTML = '<option value="">All Students</option>';
      gradeStudentSelect.innerHTML = '<option value="">Select Student</option>';
      messageRecipient.innerHTML = '<option value="">Select Recipient</option>';

      // Add student options
      students.forEach(student => {
          const option1 = document.createElement('option');
          option1.value = student.id;
          option1.textContent = `${student.firstName} ${student.lastName}`;
          gradeStudentFilter.appendChild(option1);

          const option2 = document.createElement('option');
          option2.value = student.id;
          option2.textContent = `${student.firstName} ${student.lastName}`;
          gradeStudentSelect.appendChild(option2.cloneNode(true));

          const option3 = option2.cloneNode(true);
          messageRecipient.appendChild(option3);
      });
  }

  function openStudentModal(studentId = null) {
      const modal = document.getElementById('student-modal');
      const form = document.getElementById('student-form');
      const title = document.getElementById('modal-student-title');

      if (studentId) {
          // Edit mode
          title.textContent = 'Edit Student';
          const student = students.find(s => s.id === studentId);
          
          document.getElementById('student-id').value = student.id;
          document.getElementById('first-name').value = student.firstName;
          document.getElementById('last-name').value = student.lastName;
          document.getElementById('email').value = student.email;
          document.getElementById('phone').value = student.phone;
          document.getElementById('grade-level').value = student.gradeLevel;
          document.getElementById('address').value = student.address || '';
      } else {
          // Add mode
          title.textContent = 'Add New Student';
          form.reset();
          document.getElementById('student-id').value = '';
      }

      modal.style.display = 'flex';
  }

  function openGradeModal(gradeId = null) {
      const modal = document.getElementById('grade-modal');
      const form = document.getElementById('grade-form');
      const title = document.querySelector('#grade-modal h2');

      if (gradeId) {
          // Edit mode
          title.textContent = 'Edit Grade';
          const grade = grades.find(g => g.id === gradeId);
          
          document.getElementById('grade-student').value = grade.studentId;
          document.getElementById('grade-subject').value = grade.subject;
          document.getElementById('grade-value').value = grade.grade;
          document.getElementById('grade-date').value = grade.date;
          document.getElementById('grade-notes').value = grade.notes || '';
      } else {
          // Add mode
          title.textContent = 'Add Grade';
          form.reset();
          document.getElementById('grade-date').value = today;
      }

      modal.style.display = 'flex';
  }

  function openMessageModal() {
      const modal = document.getElementById('message-modal');
      const form = document.getElementById('message-form');
      form.reset();
      modal.style.display = 'flex';
  }

  function handleStudentFormSubmit(e) {
      e.preventDefault();
      
      const studentId = document.getElementById('student-id').value;
      const firstName = document.getElementById('first-name').value;
      const lastName = document.getElementById('last-name').value;
      const email = document.getElementById('email').value;
      const phone = document.getElementById('phone').value;
      const gradeLevel = document.getElementById('grade-level').value;
      const address = document.getElementById('address').value;

      if (studentId) {
          // Update existing student
          const index = students.findIndex(s => s.id === parseInt(studentId));
          students[index] = {
              id: parseInt(studentId),
              firstName,
              lastName,
              email,
              phone,
              gradeLevel,
              address
          };

          // Update related records
          updateRelatedRecords(parseInt(studentId), `${firstName} ${lastName}`);
          
          // Add activity
          activities.push({
              id: activities.length + 1,
              type: 'student',
              description: `Updated student ${firstName} ${lastName}`,
              date: today
          });
      } else {
          // Add new student
          const newId = students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1;
          students.push({
              id: newId,
              firstName,
              lastName,
              email,
              phone,
              gradeLevel,
              address
          });

          // Add activity
          activities.push({
              id: activities.length + 1,
              type: 'student',
              description: `Added new student ${firstName} ${lastName}`,
              date: today
          });
      }

      // Close modal and refresh
      studentModal.style.display = 'none';
      renderStudentsTable();
      populateStudentFilters();
      renderDashboardStats();
      renderRecentActivity();
  }

  function handleGradeFormSubmit(e) {
      e.preventDefault();
      
      const studentId = parseInt(document.getElementById('grade-student').value);
      const subject = document.getElementById('grade-subject').value;
      const gradeValue = parseInt(document.getElementById('grade-value').value);
      const date = document.getElementById('grade-date').value;
      const notes = document.getElementById('grade-notes').value;

      const student = students.find(s => s.id === studentId);
      const studentName = `${student.firstName} ${student.lastName}`;

      if (e.target.dataset.editing) {
          // Update existing grade
          const gradeId = parseInt(e.target.dataset.editing);
          const index = grades.findIndex(g => g.id === gradeId);
          grades[index] = {
              id: gradeId,
              studentId,
              name: studentName,
              subject,
              grade: gradeValue,
              date,
              notes
          };
          
          // Add activity
          activities.push({
              id: activities.length + 1,
              type: 'grade',
              description: `Updated grade for ${studentName} in ${subject}`,
              date: today
          });
      } else {
          // Add new grade
          const newId = grades.length > 0 ? Math.max(...grades.map(g => g.id)) + 1 : 1;
          grades.push({
              id: newId,
              studentId,
              name: studentName,
              subject,
              grade: gradeValue,
              date,
              notes
          });

          // Add activity
          activities.push({
              id: activities.length + 1,
              type: 'grade',
              description: `Added grade for ${studentName} in ${subject} (${gradeValue}%)`,
              date: today
          });
      }

      // Close modal and refresh
      gradeModal.style.display = 'none';
      renderGradesTable();
      renderDashboardStats();
      renderRecentActivity();
  }

  function handleMessageFormSubmit(e) {
      e.preventDefault();
      
      const recipientId = parseInt(document.getElementById('message-recipient').value);
      const subject = document.getElementById('message-subject-input').value;
      const content = document.getElementById('message-content').value;

      const recipient = students.find(s => s.id === recipientId);
      const recipientName = `${recipient.firstName} ${recipient.lastName}`;

      // Add new message
      const newId = messages.length > 0 ? Math.max(...messages.map(m => m.id)) + 1 : 1;
      messages.push({
          id: newId,
          senderId: 0, // Assuming 0 is the teacher/admin ID
          senderName: 'Teacher',
          recipientId,
          subject,
          content,
          date: today,
          read: false
      });

      // Add activity
      activities.push({
          id: activities.length + 1,
          type: 'message',
          description: `Sent message to ${recipientName}`,
          date: today
      });

      // Close modal and refresh
      messageModal.style.display = 'none';
      renderMessages();
      renderDashboardStats();
      renderRecentActivity();
  }

  function deleteStudent(studentId) {
      if (confirm('Are you sure you want to delete this student? This will also delete all related records.')) {
          // Remove student
          students = students.filter(s => s.id !== studentId);
          
          // Remove related records
          attendance = attendance.filter(a => a.studentId !== studentId);
          grades = grades.filter(g => g.studentId !== studentId);
          
          // Add activity
          activities.push({
              id: activities.length + 1,
              type: 'student',
              description: 'Deleted a student',
              date: today
          });

          // Refresh
          renderStudentsTable();
          renderAttendanceTable();
          renderGradesTable();
          populateStudentFilters();
          renderDashboardStats();
          renderRecentActivity();
      }
  }

  function deleteGrade(gradeId) {
      if (confirm('Are you sure you want to delete this grade record?')) {
          grades = grades.filter(g => g.id !== gradeId);
          
          // Add activity
          activities.push({
              id: activities.length + 1,
              type: 'grade',
              description: 'Deleted a grade record',
              date: today
          });

          renderGradesTable();
          renderDashboardStats();
          renderRecentActivity();
      }
  }

  function markAttendance() {
      const date = attendanceDate.value;
      
      // Check if attendance already exists for this date
      const existingAttendance = attendance.filter(a => a.date === date);
      
      if (existingAttendance.length > 0) {
          if (!confirm('Attendance for this date already exists. Do you want to overwrite it?')) {
              return;
          }
          
          // Remove existing attendance for this date
          attendance = attendance.filter(a => a.date !== date);
      }
      
      // Mark all students as present by default
      students.forEach(student => {
          const newId = attendance.length > 0 ? Math.max(...attendance.map(a => a.id)) + 1 : 1;
          attendance.push({
              id: newId,
              studentId: student.id,
              name: `${student.firstName} ${student.lastName}`,
              status: 'Present',
              date
          });
      });
      
      // Add activity
      activities.push({
          id: activities.length + 1,
          type: 'attendance',
          description: `Marked attendance for ${students.length} students`,
          date: today
      });

      renderAttendanceTable();
      renderRecentActivity();
  }

  function editAttendance(attendanceId) {
      const record = attendance.find(a => a.id === attendanceId);
      const newStatus = prompt('Enter new status (Present, Absent, Late):', record.status);
      
      if (newStatus && ['Present', 'Absent', 'Late'].includes(newStatus)) {
          record.status = newStatus;
          
          // Add activity
          activities.push({
              id: activities.length + 1,
              type: 'attendance',
              description: `Updated attendance for ${record.name} to ${newStatus}`,
              date: today
          });

          renderAttendanceTable();
          renderRecentActivity();
      }
  }

  function viewMessage(messageId) {
      const message = messages.find(m => m.id === messageId);
      
      document.getElementById('message-subject').textContent = message.subject;
      document.getElementById('message-sender').textContent = `From: ${message.senderName}`;
      document.getElementById('message-date').textContent = formatDate(message.date);
      document.getElementById('message-body').innerHTML = `<p>${message.content}</p>`;
      
      // Set reply recipient
      replyText.value = '';
      document.querySelector('.message-content').dataset.threadId = messageId;
  }

  function sendReply() {
      const threadId = parseInt(document.querySelector('.message-content').dataset.threadId);
      const originalMessage = messages.find(m => m.id === threadId);
      const content = replyText.value.trim();
      
      if (!content) {
          alert('Please enter a reply message');
          return;
      }
      
      const newId = messages.length > 0 ? Math.max(...messages.map(m => m.id)) + 1 : 1;
      messages.push({
          id: newId,
          senderId: 0, // Teacher/admin
          senderName: 'Teacher',
          recipientId: originalMessage.senderId,
          subject: `Re: ${originalMessage.subject}`,
          content,
          date: today,
          read: false
      });
      
      // Add activity
      activities.push({
          id: activities.length + 1,
          type: 'message',
          description: `Replied to message from ${originalMessage.senderName}`,
          date: today
      });

      replyText.value = '';
      renderMessages();
      renderDashboardStats();
      renderRecentActivity();
  }

  function filterStudents(searchTerm) {
      const tbody = document.querySelector('#students-table tbody');
      const rows = tbody.querySelectorAll('tr');
      
      rows.forEach(row => {
          const name = row.cells[1].textContent.toLowerCase();
          const email = row.cells[2].textContent.toLowerCase();
          const phone = row.cells[3].textContent.toLowerCase();
          
          if (name.includes(searchTerm.toLowerCase()) || 
              email.includes(searchTerm.toLowerCase()) || 
              phone.includes(searchTerm.toLowerCase())) {
              row.style.display = '';
          } else {
              row.style.display = 'none';
          }
      });
  }

  function filterGrades() {
      renderGradesTable();
  }

  function updateAttendanceSummary(attendanceRecords) {
      const presentCount = attendanceRecords.filter(a => a.status === 'Present').length;
      const totalCount = attendanceRecords.length;
      const percentage = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;
      
      document.getElementById('attendance-percentage').textContent = `${percentage}%`;
      document.getElementById('attendance-progress').style.width = `${percentage}%`;
  }

  function updateRelatedRecords(studentId, newName) {
      // Update attendance records
      attendance.forEach(record => {
          if (record.studentId === studentId) {
              record.name = newName;
          }
      });
      
      // Update grade records
      grades.forEach(grade => {
          if (grade.studentId === studentId) {
              grade.name = newName;
          }
      });
  }

  function formatDate(dateString) {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
  }
});