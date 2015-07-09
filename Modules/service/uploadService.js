/**
 * @description 
 * POST
 * Upload Image Http request handler
 * @param {HTTPRequest} request
 * @param {HTTPResponse} response
 */
function processFile(request, response) {

    var returned = {
        status: false,
        result: {
            message: "",
            src: ""
        }
    };
    try {

        var userData = JSON.parse(request.parts[0].asText);
        var theImage = request.parts[1];
        var ext = getExtention(theImage.fileName);
        var fullname = userData.ID + "." + ext;
        theImage.save(ds.getModelFolder().path + "ressources/photos/" + fullname, true);

        var theUser = ds.User.find("ID =:1", userData.ID);
        theUser.avatar = theImage.asPicture;
        theUser.save();
        returned.status = true;

        returned.result.message = "Uploaded Succesfully !";
    }
    catch (e) {

        returned.result.message = "The User Image cannot be Uploaded due to :" + e.message;

    }
    finally {
        response.contentType = "application/json";
        returned.result.src = "rest/User(" + userData.ID + ")/avatar?$imageformat=best&$expand=avatar";
        response.body = JSON.stringify(returned);
    }

}

/**
 * @description 
 * get extention of Image Uploaded ==> jpg | png 
 * @param {HTTPRequest} request
 * @param {HTTPResponse} response
 */
function getExtention(fileName) {

    var ch = "";
    var fileNameSplitted = fileName.split(".");
    ch = fileNameSplitted[fileNameSplitted.length - 1];
    return ch;

}

/**
 * @description 
 * GET
 * get Image of Image Uploaded ==> jpg | png 
 * @param {HTTPRequest} request
 * @param {HTTPResponse} response
 */
function getImageByUser(request, response) {

    var folder = new Folder(ds.getModelFolder().path + "ressources/photos");
    var files = folder.files;
    var isExist = false;
    var theFile;
    var theUser = JSON.parse(request.body);
    for (var i in files) {
        theFile = files[i];
        if (theFile.name == theUser.ID + ".jpg" || theFile.name == theUser.ID + ".png") {
            isExist = true;
            break;
        }
    }

    var usering = ds.User.find("ID =:1", theUser.ID);
    if (usering != null) {
        if (usering.avatar == null) {
            response.contentType = "application/json";
            response.body = JSON.stringify({
                src: "app/images/avatar.jpg"
            });
        }
        else {
            response.contentType = "application/json";
            response.body = JSON.stringify({
                src: "rest/User(" + usering.ID + ")/avatar?$imageformat=best&$expand=avatar"
            });
        }
    }
    else {
        response.contentType = "application/json";
        response.body = JSON.stringify({
            src: null
        });
    }
    //   
    //    if (isExist) {
    ////        response.contentType = 'application/octet-stream';
    ////        response.headers['content-disposition'] = 'attachement; filename=' + theFile.name + '.jpg';
    ////        response.body = theFile.toBuffer().toBlob();
    //// 		  response.sendChunkedData(theFile);
    //		  var image = loadImage(theFile);
    //		  return image;
    //    }
    //    else {
    //          theFile = File(ds.getModelFolder().path + "ressources/photos/user-log.jpg");
    //       //   response.sendChunkedData(theFile);
    //          var image = loadImage(theFile);
    //		  return image;
    ////       
    ////        response.headers['content-disposition'] = 'attachement; filename=' + theFile.name + '.jpg';
    ////        return theFile.toBuffer().toBlob();
    //    }
}


/**
 * @description 
 * POST
 * Upload Files Http request handler
 * @param {HTTPRequest} request
 * @param {HTTPResponse} response
 */
function uploadFile(request, response) {

   var returned = {
        status: false,
        result: {
            message: "",
            value: ""
        }
    };
    try {
		
        var currentIsueId = request.parts[0].asText;
        var theFile = request.parts[1];
        
        if(theFile.size > 10485760){
        	throw new Error('file Size 10Mo Max');
        }
        

        var theIssue = ds.Issue.find("ID =:1", currentIsueId);
       	
       	var attachment = new ds.Attachment();
       		attachment.name = theFile.fileName;
       		attachment.mediaType = theFile.mediaType;
       		attachment.size = theFile.size;
       		attachment.issue = theIssue;
       		attachment.save();
       	var ext = getExtention(theFile.fileName);
	       	theFile.save(ds.getModelFolder().path + "ressources/files/" + attachment.ID+"."+ext, true);
	       	
	        returned.status = true;
			returned.result.message = "Uploaded Succesfully !";
    }
    catch (e) {

        	returned.result.message = "The File cannot be Uploaded due to :" + e.message;

    }
    finally {
	        response.contentType = "application/json";
	        returned.result.value = "";
	        response.body = JSON.stringify(returned);
    }
}

/**
 * @description 
 * GET
 * get File Uploaded ==> * 
 * @param {HTTPRequest} request
 * @param {HTTPResponse} response
 */
function getAttachment(request, response) {

    var returned = {
        status: false,
        result: {
            message: "",
            value: ""
        }
    };
    try {
		var qs = request.urlQuery;
		qs = qs.split("&");
		var params = [];
		for(var i in qs){
			var t = qs[i].split('=');
			params[t[0]] = t[1];
		}
       // var reqBody = JSON.parse(request.body);
        var attachmentId = params['ID'];
        var theFile;
        var theAttachment = ds.Attachment.find("ID =:1", attachmentId);
       	var ext = getExtention(theAttachment.name);
       		theFile = new File(ds.getModelFolder().path + "ressources/files/"+attachmentId+"."+ext);
       		
    		response.headers['content-disposition'] = 'attachement; filename='+theAttachment.name;
    		response.responseType = "blob";
    		response.contentType = theAttachment.mediaType;
    		response.body = theFile.toBuffer().toBlob();
		
    }
    catch (e) {

        	returned.result.message = "The File cannot be download due to :" + e.message;
        	response.contentType = "application/json";
	        returned.result.value = "";
	        response.body = JSON.stringify(returned);

    }
}