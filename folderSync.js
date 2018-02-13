/**
 * Author
 * ==================
 * S.Manis, Oct. 2016
 * 
 * Purpose
 * ====================================================================================
 * This utility was written with the mindset of copying only the files from a source 
 * drive/path that don't already exist on a target drive/path. Unfortunately,  I 
 * don't handle deleting orphaned files;  if you delete a file on a source drive/path,  
 * it won't be auto-removed from the target drive/path.  If you want this functionality,  
 * it's better to consider using rsync with one of the --delete options.
 * 
 * A "from/to" metaphor is used when configuring the source and target drives/paths.
 * You may configure as many from/to folder pairs as you like 
 * (see the 'folders' var below).  If you want two-way synchronization between 
 * two folders, do this:
 * 
 *	var folders = [{
 *	   from: 'G:/Some/Path/FolderA/',
 *	   to: 'C:/Some/Other/Path/To/Some/Other/FolderB/'
 *	},{
 *	   from: 'C:/Some/Other/Path/To/Some/Other/FolderB/',
 *	   to: 'G:/Some/Path/FolderA/'
 *	}]
 * 
 * Dependencies/Installation
 * ====================================================================================
 * The 'fs' package is used for reading/writing file streams. The 
 * 'readdir' package is used to synchronously read/process the contents of a folder,
 * and package 'file-exists' is used to verify the existence of target files.  To install
 * all dependencipes: 
 *  
 *	  npm install
 * 
 * Usage
 * ====================================================================================
 * First configure the 'folders' array variable with all of the desired from/to folder pairs, 
 * then:	
 *	  
 *	  node folderSync.js
 *  
 */
var fs = require('fs');
var readdir = require('readdir');
var fileExists = require('file-exists');

// An array of JSON object which model the from/to folders to be synchronized. 
// Override/add to this default example as needed.
var folders = [{
	from: '/Users/smanis/Documents/synctest/from/',
	to:   '/Users/smanis/Documents/synctest/to/'
},{
	from: '/Users/smanis/Documents/synctest/from2/',
	to:   '/Users/smanis/Documents/synctest/to2/'
}];

var folderFrom = null;
var folderTo = null;
var totalFilesCopied = 0;
var folderFilesCopied = 0;

// add a few blank lines as a visual break from any clutter already on the screen.
console.log('');
console.log('');

// Walk list of from/to folder pairs, read the 'from' folder and copy any of the files
// which don't exist in the 'to' folder.
folders.forEach(function(folderObj, index, folderObjs) {
	folderFrom = folderObj.from;
	folderTo = folderObj.to;
	folderFilesCopied = 0;

	console.log(`${folderFrom} > ${folderTo}`);
	console.log('='.repeat(132));
	var files = readdir.readSync(folderFrom);

	for (var i = 0, len = files.length; i < len; i++) {
		if (!fileExists(folderTo + files[i])) {
			console.log(`Copying ${files[i]}`);
			totalFilesCopied++;
			folderFilesCopied++;
			fs.createReadStream(folderFrom+files[i]).pipe(fs.createWriteStream(folderTo+files[i]));
		}
	}
	if (folderFilesCopied > 0) {
		console.log('-'.repeat(132));
		console.log(`Files Copied ${folderFilesCopied}\n`);
		console.log('\n\n');
	}
	else {
		console.log('Folders are in sync.  No files copied.\n\n');
	}
});

console.log('==========================');
console.log(`Total Files Copied: ${totalFilesCopied}`);
console.log('');
console.log('');