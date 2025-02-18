const Process = require("./utils/Process");

function random_number(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function random_text(characters_num) {
    let text = "";
    for(let i = 0; i < characters_num; i++) {
        //65 - 89; 97 - 122
        const letra = String.fromCharCode(random_number(65, 89));
        text += letra;
    }

    return text;
}

async function insert(threads, repeticiones) {
    let count = threads;
    return new Promise(async (resolve, reject) => {
        for(let p = 0; p < threads; p++) {
            (async () => {
                const mysql = new Process("mysql", {
                    shell: true
                });
                mysql.ProcessArguments.push("-uroot");
                mysql.ProcessArguments.push("--password=utt");
                mysql.Execute();
                mysql.Write("use Alumnos;");
                mysql.Write('\n');
        
                for(let i = 0; i < repeticiones; i++) {
                    const matricula = Math.random().toFixed(7).toString().replace('.', '');
                    const año = Math.random().toFixed(3).toString().replace('.', '');
                    const nombre = random_text(random_number(5, 20));
                    const apellidos = random_text(random_number(10, 40));
                    const password = random_text(random_number(8, 16));
                    await mysql.Write(`INSERT INTO Alumno VALUES('${matricula}', ${año}, '${nombre}', '${apellidos}', '${password}');`);
                    await mysql.Write('\n');
                }
                
                await mysql.End();
                await mysql.Finish();
                count--;
                if(count === 0) {
                    resolve(true);
                }
            })();
        }
    });
}

(async () => {
    await insert(100, 10000);
})();