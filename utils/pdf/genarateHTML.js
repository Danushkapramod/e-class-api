import moment from 'moment-timezone';


export function generateHTML(data){
    const rows = data.map(({ subject, teacher, startTime, grade, hall, day }) => 
             { 
             const formatedstartTime = moment.tz(`2000-01-01T${startTime}Z`, 'Asia').format('hh:mm A');   
             return `<tr>
                    <td>${subject}</td>
                    <td>${teacher.name}</td>
                    <td>${formatedstartTime}</td>
                    <td>${grade}</td>
                    <td>${hall}</td>
                    <td>${day}</td>
                </tr>
            `}).join('');

const html = `<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            display: flex;
            justify-content: center;
            margin: 0;
        }
        .container {
            width: 100%;
            max-width: 800px;
            padding: 16px;
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
            max-width: 7rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .max-w-16 {
            max-width: 4rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    </style>
</head>
<body>
    <div class="container">
        <table>
            <thead>
                <tr>
                    <th>Subject</th>
                    <th>Teacher</th>
                    <th>Time</th>
                    <th>Grade</th>
                    <th>Hall</th>
                    <th>Day</th>
                </tr>
            </thead>
            <tbody>
            ${rows}
            </tbody>
        </table>
    </div>
</body>
</html>`


return html
}