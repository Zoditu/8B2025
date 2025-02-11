const Process = require('./Process');

(async () => {
    const mysqldump = new Process("mysqldump");
    mysqldump.ProcessArguments.push("-uroot");
    mysqldump.ProcessArguments.push("--password=utt");
    mysqldump.ProcessArguments.push("Alumnos");
    mysqldump.ProcessArguments.push("--result-file=alumnos.sql");
    await mysqldump.ExecuteAsync(true);
    console.log(`[mysqldump] Tiempo total: ${mysqldump.EndTime - mysqldump.StartTime} ms`);

    const dropMysql = new Process("mysql"); 
    dropMysql.ProcessArguments.push("-uroot");
    dropMysql.ProcessArguments.push("--password=utt");
    dropMysql.Execute();
    dropMysql.Write("drop database Alumnos;");
    dropMysql.Write("create database Alumnos;");
    dropMysql.End();
    dropMysql.Finish(async () => {
        console.log(`[dropMysql] Tiempo total: ${dropMysql.EndTime - dropMysql.StartTime} ms`);

        const mysql = new Process("mysql");
        mysql.ProcessArguments.push("-uroot");
        mysql.ProcessArguments.push("--password=utt");
        mysql.ProcessArguments.push("Alumnos<backup.sql");
        await mysql.ExecuteAsync(true);
        console.log(`[mysqlimport] Tiempo total: ${mysql.EndTime - mysql.StartTime} ms`);
    });
})();