import { localStorage } from './localStorage';

export const generateOfficialHallTicket = (ticket: any, exam: any, student: any) => {
  const collegeSettings = JSON.parse(localStorage.getItem('collegeSettings') || '{}');
  
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Hall Ticket - ${student.rollNo}</title>
    <style>
      body { 
        font-family: 'Times New Roman', serif; 
        margin: 0; 
        padding: 20px; 
        background: white; 
        color: black;
      }
      .hall-ticket {
        max-width: 800px;
        margin: 0 auto;
        border: 3px solid #000;
        padding: 0;
      }
      .header {
        text-align: center;
        padding: 20px;
        border-bottom: 2px solid #000;
        background: #f8f9fa;
      }
      .header-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 15px;
      }
      .logo, .seal {
        width: 80px;
        height: 80px;
        object-fit: contain;
      }
      .college-info {
        flex: 1;
        text-align: center;
        padding: 0 20px;
      }
      .college-name {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 5px;
        text-transform: uppercase;
      }
      .college-address {
        font-size: 14px;
        margin-bottom: 5px;
        line-height: 1.4;
      }
      .university {
        font-size: 12px;
        font-style: italic;
        color: #666;
      }
      .hall-ticket-title {
        font-size: 20px;
        font-weight: bold;
        margin: 15px 0 10px 0;
        text-decoration: underline;
      }
      .exam-session {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 10px;
      }
      .content {
        display: flex;
        padding: 20px;
      }
      .student-photo {
        width: 120px;
        height: 150px;
        border: 2px solid #000;
        margin-right: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f8f9fa;
      }
      .student-photo img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .details {
        flex: 1;
      }
      .details-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px 30px;
        margin-bottom: 20px;
      }
      .detail-item {
        display: flex;
        margin-bottom: 8px;
      }
      .label {
        font-weight: bold;
        min-width: 140px;
        margin-right: 10px;
      }
      .value {
        flex: 1;
        border-bottom: 1px dotted #000;
        padding-bottom: 2px;
      }
      .exam-details {
        border: 1px solid #000;
        margin: 20px 0;
        padding: 15px;
        background: #f8f9fa;
      }
      .exam-title {
        font-size: 16px;
        font-weight: bold;
        text-align: center;
        margin-bottom: 15px;
        text-decoration: underline;
      }
      .instructions {
        border: 1px solid #000;
        margin: 20px 0;
        padding: 15px;
      }
      .instructions h3 {
        margin-top: 0;
        color: #d32f2f;
        text-align: center;
        text-decoration: underline;
      }
      .instructions ol {
        margin: 10px 0;
        padding-left: 20px;
      }
      .instructions li {
        margin-bottom: 5px;
        line-height: 1.4;
      }
      .footer {
        display: flex;
        justify-content: space-between;
        align-items: end;
        padding: 20px;
        border-top: 1px solid #000;
      }
      .signature-section {
        text-align: center;
      }
      .signature-image {
        width: 120px;
        height: 60px;
        object-fit: contain;
        margin-bottom: 5px;
      }
      .signature-line {
        border-top: 1px solid #000;
        width: 150px;
        margin: 10px auto 5px auto;
      }
      .date-section {
        text-align: left;
      }
      @media print {
        body { margin: 0; padding: 10px; }
        .hall-ticket { border: 2px solid #000; }
      }
    </style>
  </head>
  <body>
    <div class="hall-ticket">
      <!-- Header -->
      <div class="header">
        <div class="header-top">
          <div class="logo">
            ${collegeSettings.collegeLogo ? `<img src="${collegeSettings.collegeLogo}" alt="College Logo" class="logo" />` : '<div style="border: 1px solid #ccc; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; font-size: 10px;">LOGO</div>'}
          </div>
          <div class="college-info">
            <div class="college-name">${collegeSettings.collegeName || 'COLLEGE NAME'}</div>
            <div class="college-address">${collegeSettings.collegeAddress || 'College Address'}</div>
            <div>Phone: ${collegeSettings.collegePhone || 'Phone Number'} | Email: ${collegeSettings.collegeEmail || 'Email'}</div>
            <div class="university">Affiliated to: ${collegeSettings.affiliatedUniversity || 'University Name'}</div>
          </div>
          <div class="seal">
            ${collegeSettings.collegeSeal ? `<img src="${collegeSettings.collegeSeal}" alt="College Seal" class="seal" />` : '<div style="border: 1px solid #ccc; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; font-size: 10px;">SEAL</div>'}
          </div>
        </div>
        <div class="hall-ticket-title">EXAMINATION HALL TICKET</div>
        <div class="exam-session">${exam.title} - ${new Date(exam.date).getFullYear()}</div>
      </div>

      <!-- Content -->
      <div class="content">
        <div class="student-photo">
          ${ticket.studentPhoto ? `<img src="${ticket.studentPhoto}" alt="Student Photo" />` : '<div style="font-size: 12px; text-align: center;">STUDENT<br/>PHOTO</div>'}
        </div>
        
        <div class="details">
          <div class="details-grid">
            <div class="detail-item">
              <span class="label">Student Name:</span>
              <span class="value">${student.name}</span>
            </div>
            <div class="detail-item">
              <span class="label">Roll Number:</span>
              <span class="value">${student.rollNo}</span>
            </div>
            <div class="detail-item">
              <span class="label">Department:</span>
              <span class="value">${student.department}</span>
            </div>
            <div class="detail-item">
              <span class="label">Class:</span>
              <span class="value">${student.class}</span>
            </div>
            <div class="detail-item">
              <span class="label">Father's Name:</span>
              <span class="value">${student.fatherName || 'N/A'}</span>
            </div>
            <div class="detail-item">
              <span class="label">College Code:</span>
              <span class="value">${collegeSettings.collegeCode || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Exam Details -->
      <div class="exam-details">
        <div class="exam-title">EXAMINATION DETAILS</div>
        <div class="details-grid">
          <div class="detail-item">
            <span class="label">Subject:</span>
            <span class="value">${exam.subject}</span>
          </div>
          <div class="detail-item">
            <span class="label">Date:</span>
            <span class="value">${exam.date}</span>
          </div>
          <div class="detail-item">
            <span class="label">Time:</span>
            <span class="value">${exam.startTime} - ${exam.endTime}</span>
          </div>
          <div class="detail-item">
            <span class="label">Duration:</span>
            <span class="value">${exam.duration} minutes</span>
          </div>
          <div class="detail-item">
            <span class="label">Venue:</span>
            <span class="value">${exam.venue}</span>
          </div>

          <div class="detail-item">
            <span class="label">Exam Type:</span>
            <span class="value">${exam.type || 'Regular'}</span>
          </div>
        </div>
      </div>

      <!-- Instructions -->
      <div class="instructions">
        <h3>IMPORTANT INSTRUCTIONS</h3>
        <ol>
          <li>Bring this hall ticket to the examination hall. Entry will not be permitted without it.</li>
          <li>Report to the examination center at least 30 minutes before the commencement of examination.</li>
          <li>Bring valid photo identification (Student ID Card, Aadhar Card, etc.).</li>
          <li>Mobile phones, electronic devices, and unauthorized materials are strictly prohibited.</li>
          <li>Follow all examination rules and regulations as prescribed by the college/university.</li>
          <li>Any malpractice or unfair means will result in cancellation of examination.</li>
          <li>Students must occupy only the allotted seat mentioned in this hall ticket.</li>
          <li>Late entry beyond 30 minutes after commencement will not be allowed.</li>
        </ol>
      </div>

      <!-- Footer -->
      <div class="footer">
        <div class="date-section">
          <div><strong>Date of Issue:</strong> ${new Date(ticket.generatedAt).toLocaleDateString()}</div>
          <div style="margin-top: 10px;"><strong>Hall Ticket No:</strong> ${ticket.id.substring(0, 8).toUpperCase()}</div>
        </div>
        
        <div class="signature-section">
          ${collegeSettings.principalSignature ? `<img src="${collegeSettings.principalSignature}" alt="Principal Signature" class="signature-image" />` : '<div style="height: 60px;"></div>'}
          <div class="signature-line"></div>
          <div><strong>Principal</strong></div>
          <div>${collegeSettings.principalName || 'Principal Name'}</div>
        </div>
      </div>
    </div>
  </body>
  </html>
  `;
};