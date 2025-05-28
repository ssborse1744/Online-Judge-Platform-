const fs=require('fs');
const path= require('path');
const {v4: uuid}=require('uuid');

const dirCodes = path.join(__dirname,'codes');//root_dir+codes
//D:\Online Compiler\Online-Compiler\Backend\codes

//if codes folder exist then do not create 
//else create it 
if(!fs.existsSync(dirCodes)){
    fs.mkdirSync(dirCodes,{recursive:true});
    // The 'recursive:true' option ensures that any parent directories are also created if they don't exist.
}

const generateFile = (language,code)=>{
    const jobId=uuid();//8e29abca-34e4-4d2a-93ae-8de2e02c3a18
    const filename = `${jobId}.${language}`;//8e29abca-34e4-4d2a-93ae-8de2e02c3a18.cpp
    const filePath = path.join(dirCodes,filename);
    //D:\Online Compiler\Online-Compiler\Backend\codes\8e29abca-34e4-4d2a-93ae-8de2e02c3a18.cpp
    fs.writeFileSync(filePath,code);
    return filePath;
};

module.exports={
    generateFile,
};