
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const admin = require("firebase-admin");
const inquirer  = require('./inquirer');
const fs = require('fs');
const path = require('path');
const {getServiceAccount,getFirebaseEnv} = require("./utils");
const envFb = getFirebaseEnv();
const serviceAccount = getServiceAccount();
if(serviceAccount === null){
    console.error('Missing serviceAccount.json')
    process.exit(1);
}
if(typeof envFb['FIREBASE_DATABASE_URL'] === 'undefined'){
    console.error('Missing FIREBASE_DATABASE_URL check your .env file')
    process.exit(1);
}
admin.initializeApp({
    credential: admin.credential.cert( serviceAccount),
    databaseURL: "https://epicor-ef88b.firebaseio.com"
});

clear();
console.log(
    chalk.yellow(
        figlet.textSync('Firebase Admin', { horizontalLayout: 'full' })
    )
);

function loopMenu(result,store=false){
    let runNext = '';
    let obj = store;
    return new Promise(async (resolve) => {
        if(typeof result.runNext != 'undefined'){
            runNext = result.runNext.next;
            extra = result.runNext.extra;
            delete result.runNext;
            Object.assign(extra,result);
            obj = store !== false ? store : extra;
            Object.assign(obj,extra);
            const res = await inquirer[runNext]();
            await loopMenu(res,obj);
        }
        // console.log('obj :',obj, 'loop result', result);
        Object.assign(obj,result);
         resolve(obj);
    });
}

async function getUser(uid){
    await admin.auth().getUser(uid)
        .then(function(userRecord) {
            // See the UserRecord reference doc for the contents of userRecord.
            console.log('Successfully fetched user data:', userRecord.toJSON());
        })
        .catch(function(error) {
            console.log('Error fetching user data:', error);
        });

}

async function setClaim(uid,claim){
    await admin.auth().setCustomUserClaims(uid, claim ).then(async() => {
        // See the UserRecord reference doc for the contents of userRecord.
        console.log('Successfully updated user claim');
        await getUser(uid);
    });
}
async function updateUser(uid,change, value){
    if(change === 'claim'){
        const claim = value !== false ? {[value]: true} : {};
        await setClaim(uid,claim);
        return;
    }

    const userData = {
        [change]: value,
    }

    await admin.auth().updateUser(uid, userData)
        .then(function(userRecord) {
            // See the UserRecord reference doc for the contents of userRecord.
            console.log('Successfully updated user', userRecord.toJSON());
        })
        .catch(function(error) {
            console.error('Error updating user:', error);
        });

}
function createUser(email,password,displayName,claim = false){
    admin.auth().createUser({
        email,
        // emailVerified: false,
        // phoneNumber: '+11234567890',
        password,
        displayName,
        // photoURL: 'http://www.example.com/12345678/photo.png',
        // disabled: false
    }) .then(function(userRecord) {
        // See the UserRecord reference doc for the contents of userRecord.
        console.log('Successfully created new user:', userRecord.uid);
    })
        .catch(function(error) {
            console.log('Error creating new user:', error);
        });


}
function parseFile(file){
    const dir =  path.resolve(`${process.cwd()}/jsons/`);
    console.log(dir);
    const filename = `${dir}/${file}`;
    fs.readFile(filename, (err, data) => {
        if (err) throw err;
        let jsonFile = JSON.parse(data);
        const jsonKeys = jsonFile != null ? Object.keys(jsonFile) : {};
        const totalJson = jsonKeys.length;
        if(totalJson > 0){
            jsonKeys.map((key, index)=>{
                createUser(jsonFile[key].email,'test123',`${jsonFile[key].firstName} ${jsonFile[key].lastName}`)
            });
        }
        // console.log(jsonFile);
    });

}
const run = async () => {
    const askPath = await inquirer.askPath();

    const result = await loopMenu(askPath);
    switch (result.action){
        case 'add':
            createUser(result.email,'test123','Guest',claim = false)
            break;
        case 'addFile':
            parseFile(result.file);
            break;
        case 'show':
            getUser(result.uid);
            break;
        case 'update':
              await updateUser(result.uid, result.change,result[result.change]);
              run();
            break;
        default:
            console.log('No Available Option')
    }
    // const resultKeys = Object.keys(result);
    // resultKeys.map((key,index)=>{
    //     console.log(key,result[key]);
    // })
};

run();
