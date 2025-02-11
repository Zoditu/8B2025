const Process = require('./Process');
const FileStream = require('fs');

let procesos = 2;
let tiempoMysql, tiempoMongo;

const mysql = new Process("mysql.exe");
mysql.ProcessArguments.push("-uroot");
mysql.ProcessArguments.push("--password=utt");
mysql.Options = {
    shell: true,
    detached: false
};

mysql.Execute();
mysql.Write("use Alumnos;");
mysql.Write("SELECT * FROM Alumno;");
mysql.End();
mysql.Finish(() => {
    procesos--;
    tiempoMysql = mysql.EndTime - mysql.StartTime;
    if(procesos === 0) {
        generarReporte();
    }
    //console.log(`[mysql] Log:`);
    //console.log(`${mysql.Logs}`);
    console.log(`[mysql] Tiempo total: ${mysql.EndTime - mysql.StartTime}`);
});

const mongo = new Process("mongosh");
mongo.Options = {
    shell: true,
    detached: false
};

mongo.Execute();
mongo.Write("use Alumnos;");
mongo.Write("\n");
mongo.Write("db.Alumnos.find();");
mongo.End();
mongo.Finish(() => {
    procesos--;
    tiempoMongo = mongo.EndTime - mongo.StartTime;
    if(procesos === 0) {
        generarReporte();
    }
    //console.log(`[mongo] Log:`);
    //console.log(`${mongo.Logs}`);
    console.log(`[mongo] Tiempo total: ${mongo.EndTime - mongo.StartTime}`);
});

function generarReporte() {

    const grafico = {
        type: "bar",
        labels: `['MySQL', 'Mongo']`,
        data: `[${tiempoMysql}, ${tiempoMongo}]`,
        title: "Tiempo de ejecución de BDD"

    }

    const reporte = 
    `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <title>Métricas de BDD</title>
    </head>
    <body>
        <div>
            <canvas id="grafico"></canvas>
        </div>

        <script>
            const ctx = document.getElementById('grafico');

            new Chart(ctx, {
                type: '${grafico.type}',
                data: {
                labels: ${grafico.labels},
                datasets: [{
                    label: '${grafico.title}',
                    data: ${grafico.data},
                    borderWidth: 1
                }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        </script>
    </body>
    </html>
    `;

    FileStream.writeFileSync("reporte.html", reporte);
}