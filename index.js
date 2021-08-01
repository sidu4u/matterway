/**
 * @typedef {{isDirectory: boolean, name: string, files?: File[]}} File
 *
 * @param {File[]} files
 * @param {string[]} ignorePatterns
 * @returns {string[]}
 */



const getAllFilesExcept = (files, ignorePatterns) => {
  const result = [];
  // TODO
  driver(files,ignorePatterns);
  getNonIgnoredFiles(files,result);
  return result;
};


const getNonIgnoredFiles = (root,result,prefix)=>{
    if(root.constructor===Array){
      root.forEach(ele => getNonIgnoredFiles(ele,result,"/"));
    }
    else if(root.isDirectory){
     root.files.forEach(ele => getNonIgnoredFiles(ele,result,`${prefix}${root.name}/`));
    }
    else if(!root.ignore){
      result.push(`${prefix}${root.name}`);
    }
}

// const getStatus = (files,path,index)=>{
//   let file = path[index];
//   if(index===path.length-1){
//       return files[file].isDirectory;
//   }
//   else{
//     return getStatus(files[file],path,index+1);
//   }
// }

const setAllFiles = (node,ignore)=>{
  if(!node){
    return;
  }
  if(node.constructor===Array){
    node.forEach(ele=>setAllFiles(ele,ignore));
    return;
  }
  if(node.isDirectory){
    setAllFiles(node.files,ignore);
    return;
  }
  node.ignore = ignore; 
}

// const setPath = (files,path,ignore,index)=>{
//   let file = path[index];
//   if(index===path.length-1){
//       files[file].ignore = ignore;
//       return;
//   }
//   else{
//     setPath(files[file],path,ignore,index+1);
//   }
// }

const getNode = (root,path,index)=>{
  let fileName = path[index];
  let node;
  // let file = files.filter(ele=>ele.name===fileName)[0];
  if(!root){
    return false;
  }
  if(index===path.length){
    return root;
  }
  if (root.constructor===Array){
   node = root.filter(ele=>ele.name===fileName)[0];
  }
  else{
    node = root.files.filter(ele=>ele.name===fileName)[0];
  }
  

  return getNode(node,path,index+1);

}

const driver=(files, ignorePatterns)=>{
  let paths;
  let node;
  let whiteList;
  for(let path of ignorePatterns){
    paths = path.split('/');
    if(paths[0]==="!"){
     whiteList=true; 
    }
    else{
      whiteList=false; 
    }
    node = getNode(files,paths.slice(1),0);
    if(node&&node.isDirectory){
      setAllFiles(node,whiteList?false:true);
    }
    else if (node){
      node.ignore = whiteList?false:true;
    }

  }
}

// console.log(getAllFilesExcept(
//   [
//     {isDirectory: false, name: 'index.js'},
//     {isDirectory: false, name: 'package.json'},
//     {
//       isDirectory: true,
//       name: 'dist',
//       files: [
//         {isDirectory: false, name: 'index.js'},
//         {isDirectory: false, name: 'bin'}
//       ]
//     }
//   ],
//   ['/dist', '!/dist/index.js', '/index.js']
// ));

console.log( getAllFilesExcept(
      [
        {isDirectory: false, name: 'index.js'},
        {
          isDirectory: true,
          name: 'src',
          files: [
            {isDirectory: false, name: 'index.js'},
            {isDirectory: false, name: 'test.js'}
          ]
        },
        {
          isDirectory: true,
          name: 'src (2)',
          files: [
            {isDirectory: false, name: 'a.js'},
            {
              isDirectory: true,
              name: 'src',
              files: [
                {isDirectory: false, name: 'index2.js'},
                {isDirectory: false, name: 'b.js'}
              ]
            }
          ]
        }
      ],
      ['!/src (2)/src/index2.js.js', '/src (2)', '!/src (2)/src/b.js', '/src'])
    )

module.exports.getAllFilesExcept = getAllFilesExcept;
