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
  
export function generateHTML(_data,category){

 const {data,user,_class}  = _data
 let html;   
 if(category === 'class'){
    const date = formatDate()
    const rows = data.map(({ subject, teacher, startTime, grade, hall, day },index) => 
             `<tr>
                    <td>${(index+1).toString().padStart(2, '0')}</td>
                    <td class="max-w-28 capitalize">${subject || '------'}</td>
                    <td class="max-w-28 capitalize">${teacher?.name || '------'}</td>
                    <td>${formatedstartTime(startTime) || '------'}</td>
                    <td class="max-w-16">${grade || '------'}</td>
                    <td class="max-w-16">${hall || '------'}</td>
                    <td class='capitalize pr-6'>${day || '------'}</td>
                </tr>
            `).join('');

 html = `<html>
<head>
    <style>
      @page {
        margin: 1cm; 
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
          <div>${data.length} results</div>
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
      @page {
        margin: 1cm; 
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




if(category === 'student'){
    const date = formatDate()
    const rows = data.map(({name,phone,studentId},index) => 
               `<tr>
                    <td style='width:1px;'>${(index+1).toString().padStart(2, '0')}</td>
                    <td class="max-w-16">${studentId}</td>
                    <td class="max-w-28 capitalize">${name}</td>
                    <td class="max-w-28">${phone}</td>
                </tr>
             `).join('');


 html = `<html>
<head>
    <style>
     @page {
        margin: 1cm; 
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
          <div>Reacher grade 13</div>
          <div>${data.length} results</div>
        </div>
      </div>
        <table>
            <thead>
                <tr>
                    <th >#</th>
                    <th>ID</th>
                    <th>Name</th>
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



 const rangeList = []
 const length = data.length;
  function calculateRangeList(){
    const page1 = 68;
    const other = 72;
    const isHasOtheePage = length > page1
    rangeList.push([[0,page1/2],[page1/2,page1]])

    if(isHasOtheePage){
        let otherPageStartAt = page1;
        const otherPagesCount = Math.ceil((length - page1) / other)
        // eslint-disable-next-line no-plusplus
        for(let i = 0;i<otherPagesCount;i++){
            const side1 = [otherPageStartAt,otherPageStartAt+(other/2)]
            const side2 = [otherPageStartAt + (other/2),otherPageStartAt+other]
            rangeList.push([side1,side2])
            otherPageStartAt +=  other
        }
    }
  }

  
   function setSide1(side){
    const side1Ranges = rangeList.map((range)=>range[side])
     const side1Htm = side1Ranges.map(([start,end])=>
         data.slice(start,end).map(({ studentId, name },index) => 
           `<tr>
              <td>${(start + 1+ index).toString().padStart(2, '0')}</td>
              <td>${studentId}</td>
              <td>
                <div class="namefield">${name}</div>
              </td>
              <td class="statusField"></td>
            </tr>`
          ).join('')
    ).join('')
    return side1Htm
  }

  function setSide2(side){
    const side1Ranges = rangeList.map((range)=>range[side])
     const side1Htm = side1Ranges.map(([start,end])=>
         data.slice(start,end).map(({ studentId, name,status
          },index) => 
           `<tr>
              <td>${(start + 1+ index).toString().padStart(2, '0')}</td>
              <td>${studentId}</td>
              <td>
                <div class="namefield">${name}</div>
              </td>
              <td class="statusField">${status}</td>
            </tr>`
          ).join('')
    ).join('')
    return side1Htm
  }

if(category === 'paymentsSheet'){

  calculateRangeList()
  const side1 = setSide1(0)
  const side2 = setSide1(1)

 html = `
<html>
<head>
  <style>
    @page {
       margin: 1cm;
    }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      box-sizing: border-box;
    }
    table {
      width: 100%;
      color: #000000;
      border-collapse: collapse;
    }
    th, td {
      padding: 4px 8px;
      text-align: left;
      border: 1px solid #000000;
    }
    td {
      font-size: 14px;
    }
    th {
      font-weight: 600;
      font-size: 14px;
    }
    .section {
      padding-left: 0;
      padding-right: 0;
      width: 100%;
    }
    .nameField {
      white-space: nowrap;
      max-width: 12rem;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  </style>
</head>
<body style=" display: flex; flex-direction: column; align-items: center;">
  <div style="width:100%">
    <div class="section">
      <div style="display: flex; justify-content: space-between; 
      width: 100%; font-size: 0.875rem;">
      <div style=" flex-basis: 24rem;">
          <div style="display: flex;">
         <div style="flex-basis: 3.5rem;">Institute</div>
            <div style="text-transform: capitalize;">: ${user.metaData.instituteName}, ${user.metaData.city}</div>
          </div>
          <div style="display: flex;">
            <div style="flex-basis: 3.5rem;">Teacher</div>
            <div style="text-transform: capitalize";">: ${_class.teacher.name}</div>
          </div>
          <div style="display: flex;">
            <div style="flex-basis: 3.5rem;">Class</div>
            <div style="text-transform: capitalize;">: ${_class.subject} & ${_class.grade}</div>
          </div>
        </div>
        <div style="flex-basis: 10rem; display: flex; gap: 0.25rem; flex-direction: column; justify-content: center;">
          <div style="display: flex; align-items: center;">
            <div style="margin-right: 0.25rem; flex-basis: 3.5rem;">Amount</div>:
            <div style="height: 1rem; width: 5rem; border-bottom: 1px solid black;"></div>
          </div>
          <div style="display: flex; align-items: center;">
            <div style="margin-right: 0.25rem; flex-basis: 3.5rem;">Paids</div>:
            <div style="height: 1rem; width: 5rem; border-bottom: 1px solid black;"></div>
          </div>
        </div>

        <div style="flex: 0 0 5rem; display: flex; justify-content: end; 
        flex-direction: column; align-items: flex-end;">
          <div>${data.length.toString().padStart(2,'0')} Total</div>
        </div>
      </div>
    </div>
    <div style="width: 100%; display: flex; margin-top: 0.25rem; align-items:start; justify-content:center;">
      <table style="width:calc(50% - 1px); ${data.length < 33 && 'width: calc(100% - 2px) !important;'}">
        <thead>
          <tr>
            <th style="width: 1px;">#</th>
            <th style="width: 1px;">ID</th>
            <th>Name</th>
            <th style="width: 40px; text-align:center;">
              <svg style="max-height:24px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#000000">
                <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>
              </svg>
            </th>
          </tr>
        </thead>
        <tbody>
          ${side1}
        </tbody>
      </table>
     ${data.length > 34 ? `<table style="width:calc(50% - 1px);">
        <thead>
          <tr>
            <th style="width: 1px;">#</th>
            <th style="width: 1px;">ID</th>
            <th>Name</th>
            <th style="width: 40px; text-align:center;">
              <svg  style="max-height:24px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#000000">
                <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>
              </svg>
            </th>
          </tr>
        </thead>
        <tbody>
          ${side2}
        </tbody>
      </table>`:''}
    </div>
</body>
</html>
`
}




if(category === 'paymentsSheetFilled'){
  
  calculateRangeList()
  const side1 = setSide2(0)
  const side2 = setSide2(1)

 html = `
<html>
<head>
  <style>
    @page {
       margin: 1cm;
    }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      box-sizing: border-box;
    }
    table {
      width: 100%;
      color: #000000;
      border-collapse: collapse;
    }
    th, td {
      padding: 4px 8px;
      text-align: left;
      border: 1px solid #000000;
    }
    td {
      font-size: 14px;
    }
    th {
      font-weight: 600;
      font-size: 14px;
    }
    .section {
      padding-left: 0;
      padding-right: 0;
      width: 100%;
    }
    .nameField {
      white-space: nowrap;
      max-width: 12rem;
      overflow: hidden;
      text-overflow: ellipsis;
    }
     .statusField {
      white-space: nowrap;
      max-width: 4rem;
      overflow: hidden;
      text-overflow: ellipsis;
    }  
  </style>
</head>
<body style=" display: flex; flex-direction: column; align-items: center;">
  <div style="width:100%">
    <div class="section">
      <div style="display: flex; justify-content: space-between; 
      width: 100%; font-size: 0.875rem;">
      <div style=" flex-basis: 24rem;">
          <div style="display: flex;">
            <div style="flex-basis: 3.5rem;">Institute</div>
            <div style="text-transform: capitalize;">: ${user.metaData.instituteName}, ${user.metaData.city}</div>
          </div>
          <div style="display: flex;">
            <div style="flex-basis: 3.5rem;">Teacher</div>
            <div style="text-transform: capitalize";">: ${_class.teacher.name}</div>
          </div>
          <div style="display: flex;">
            <div style="flex-basis: 3.5rem;">Class</div>
            <div style="text-transform: capitalize;">: ${_class.subject} & ${_class.grade}</div>
          </div>
        </div>
  
        <div style="flex: 0 0 5rem; display: flex; justify-content: end; 
        flex-direction: column; align-items: flex-end;">
          <div>${data.length.toString().padStart(2,'0')} Total</div>
        </div>
      </div>
    </div>
    <div style="width: 100%; display: flex; margin-top: 0.25rem; align-items:start; justify-content:center;">
      <table style="width:calc(50% - 1px); ${data.length < 33 && 'width: calc(100% - 2px) !important;'}">
        <thead>
          <tr>
            <th style="width: 1px;">#</th>
            <th style="width: 1px;">ID</th>
            <th>Name</th>
            <th style="width: 40px; text-align:center;">
             Status
            </th>
          </tr>
        </thead>
        <tbody>
          ${side1}
        </tbody>
      </table>
     ${data.length > 34 ? `<table style="width:calc(50% - 1px);">
        <thead>
          <tr>
            <th style="width: 1px;">#</th>
            <th style="width: 1px;">ID</th>
            <th>Name</th>
            <th style="width: 40px; text-align:center;">
             Status
            </th>
          </tr>
        </thead>
        <tbody>
          ${side2}
        </tbody>
      </table>`:''}
    </div>
</body>
</html>
`
}


if(category === 'footer'){
  return `<div style="font-size:14px; display: flex; align-items: center;
            justify-content: space-between; padding:0 1cm; width:100%;">
            <div>Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>
             <div style="font-size:12px;"> ${user.metaData.instituteName} ${user.metaData.city}</div>
            <div>${formatDate()}</div>
           </div>`
}



return html
}
