const Process = require('./Process');

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
    //console.log(`[mongo] Log:`);
    //console.log(`${mongo.Logs}`);
    console.log(`[mongo] Tiempo total: ${mongo.EndTime - mongo.StartTime}`);
});