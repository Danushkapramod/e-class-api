import moment from 'moment-timezone';


function formatDate() {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function formatedstartTime(startTime) {
    return moment
      .tz(`2000-01-01T${startTime}Z`, 'Asia/Colombo|LMT MMT +0530 +06 +0630')
      .format('hh:mm A');
  }
  
export function generateHTML(data,category){
 let html;   
 if(category === 'class'){
    let length = 0;
    const date = formatDate()
    const rows = data.map(({ subject, teacher, startTime, grade, hall, day },index) => 
             { 
             length += 1   
             return `<tr>
                    <td>${(index+1).toString().padStart(2, '0')}</td>
                    <td class="max-w-28 capitalize">${subject || '------'}</td>
                    <td class="max-w-28 capitalize">${teacher?.name || '------'}</td>
                    <td>${formatedstartTime(startTime) || '------'}</td>
                    <td class="max-w-16">${grade || '------'}</td>
                    <td class="max-w-16">${hall || '------'}</td>
                    <td class='capitalize pr-6'>${day || '------'}</td>
                </tr>
            `}).join('');


 html = `<html>
<head>
    <style>
      @page {
        margin: 24px; /* Adjust the margin as needed */
      }
       .pr-6{
           padding-right:24px ;
       }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f9f9f9;
            display: flex;
            justify-content: center;
            margin: 0;
        }
        .container {
            width: 100%;
            max-width: 800px;
            
            background-color: #fff;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        table {
            width: 100%;
            border-collapse: collapse;
            color: #1e293b;
        }
        thead {
            background-color: #64748B;
            color: #E5E7EB;
        }
        th, td {
            padding: 8px 12px;
            text-align: left;
        }
        tbody tr{
            border-bottom: 1px solid #e2e8f0;
        }    
        td {
            font-size: 14px;
        }    
        th {
            font-weight: 600;
        }
        tbody tr:nth-child(even) {
            background-color: #f8f9fa;
        }
        .max-w-28 {
            max-width: 128px;
            overflow: hidden;
            text-overflow: ellipsis;
 
        }
        .max-w-16 {
            max-width: 4rem;
            overflow: hidden;
            text-overflow: ellipsis;
   
        }
        .number{
            width:4px;
            color:#64748b;

        }
        .section{
        margin-top: 1rem;
        padding-left: 1rem /* 16px */;
        padding-right: 1rem /* 16px */;
      }
      .date{
        text-align: end;
        font-size:14px;
      }
      .title{
        text-align: center;
        font-size: 1.25rem /* 20px */;
        line-height: 1.75rem /* 28px */;
        font-weight: 700;
      }
      .data-1{
        display: flex;
        font-size:14px;
        justify-content: space-between;
      }   
      .capitalize{
      text-transform: capitalize;
      }
      .w-4{
        width: 4px;
      }

    </style>
</head>
<body>
    <div class="container">
     <div class="section">
        <div class="date"><span>Date :  </span>${date}</div>
        <div class="title">EduSuite</div>
        <div class="data-1">
          <div>All Classes</div>
          <div>${length} results</div>
        </div>
      </div>
        <table>
            <thead>
                <tr>
                    <th class='number'>#</th>
                    <th>Subject</th>
                    <th>Teacher</th>
                    <th>Time</th>
                    <th>Grade</th>
                    <th>Hall</th>
                    <th class='w-4'>Day</th>
                </tr>
            </thead>
            <tbody>
            ${rows}
            </tbody>
        </table>
    </div>
</body>
</html>`
}




if(category === 'teacher'){
    let length = 0;
    const date = formatDate()
    const rows = data.map(({ subject, name,phone},index) => 
             { 
             length += 1   
             return `<tr>
                    <td>${(index+1).toString().padStart(2, '0')}</td>
                    <td class="max-w-28 capitalize">${name}</td>
                    <td class="max-w-28 capitalize">${subject}</td>
                    <td class="max-w-16">${phone}</td>
                </tr>
            `}).join('');


 html = `<html>
<head>
    <style>
       .pr-6{
           padding-right:24px ;
       }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f9f9f9;
            display: flex;
            justify-content: center;
            margin: 0;
        }
        .container {
            width: 100%;
            max-width: 800px;
            padding: 24px;
            background-color: #fff;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        table {
            width: 100%;
            border-collapse: collapse;
            color: #1e293b;
        }
        thead {
            background-color: #64748B;
            color: #E5E7EB;
        }
        th, td {
            padding: 8px 12px;
            text-align: left;
        }
        tbody tr{
            border-bottom: 1px solid #e2e8f0;
        }    
        td {
            font-size: 14px;
        }    
        th {
            font-weight: 600;
        }
        tbody tr:nth-child(even) {
            background-color: #f8f9fa;
        }
        .max-w-28 {
            max-width: 128px;
            overflow: hidden;
            text-overflow: ellipsis;
 
        }
        .max-w-16 {
            max-width: 4rem;
            overflow: hidden;
            text-overflow: ellipsis;
   
        }
        .number{
            width:4px;
            color:#64748b;

        }
        .section{
        margin-top: 1rem;
        padding-left: 1rem /* 16px */;
        padding-right: 1rem /* 16px */;
      }
      .date{
        text-align: end;
        font-size:14px;
      }
      .title{
        text-align: center;
        font-size: 1.25rem /* 20px */;
        line-height: 1.75rem /* 28px */;
        font-weight: 700;
      }
      .data-1{
        display: flex;
        font-size:14px;
        justify-content: space-between;
      }   
      .capitalize{
      text-transform: capitalize;
      }
      .w-4{
        width: 4px;
      }

    </style>
</head>
<body>
    <div class="container">
     <div class="section">
        <div class="date"><span>Date :  </span>${date}</div>
        <div class="title">EduSuite</div>
        <div class="data-1">
          <div>All Teachers</div>
          <div>${length} results</div>
        </div>
      </div>
        <table>
            <thead>
                <tr>
                    <th class='number'>#</th>
                    <th>Teacher</th>
                    <th>Subject</th>
                    <th>Phone</th>

                </tr>
            </thead>
            <tbody>
            ${rows}
            </tbody>
        </table>
    </div>
</body>
</html>`
}

return html
}