/*

Use Cognitive Services Face resource to detect faces in a list of images. 

Requires:

Azure subscription, Azure resource group, Azure Face resource already exists. 

Add your Face resource key and name:
* "REPLACE-WITH-YOUR-FACE-RESOURCE-KEY"
* "REPLACE-WITH-YOUR-FACE-RESOURCE-NAME"

References: 
* [Azure SDK Ref Docs for Face detectWithUrl](https://docs.microsoft.com/en-us/javascript/api/@azure/cognitiveservices-face/face?view=azure-node-latest#detectWithUrl_string__Models_FaceDetectWithUrlOptionalParams_)
* [Azure Service documentation for Face](https://docs.microsoft.com/en-us/azure/cognitive-services/face/)

*/

const msRest = require("@azure/ms-rest-js");
const Face = require("@azure/cognitiveservices-face");

const azureResourceKey = process.env["FACE-RESOURCE-KEY"] || "REPLACE-WITH-YOUR-FACE-RESOURCE-KEY";
const azureResourceName = process.env["FACE-RESOURCE-NAME"] || "REPLACE-WITH-YOUR-FACE-RESOURCE-NAME";

endpoint = `https://${azureResourceName}.cognitiveservices.azure.com/`


const credentials = new msRest.ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': azureResourceKey } });
const client = new Face.FaceClient(credentials, endpoint);


const image_base_url = "https://csdx.blob.core.windows.net/resources/Face/Images/";
const person_group_id = uuid();


const detectImage = async (image_file_name) => {
    
    const options = {
        returnFaceAttributes: ["Accessories","Age","Blur","Emotion","Exposure","FacialHair","Gender","Glasses","Hair","HeadPose","Makeup","Noise","Occlusion","Smile"],
        
        // detection model 1 = retrieving attributes.
        detectionModel: "detection_01"
    }
    
    return await client.face.detectWithUrl(image_base_url + image_file_name, options);
};

const processImageList = async () => {

    // Create a list of images
	const image_file_names = [
		"detection1.jpg",    // single female with glasses
		"detection5.jpg",    // family, woman child man
		"detection6.jpg"     // elderly couple, male female
    ];
    
    let results = [];

    for (let i = 0; i < image_file_names.length; i++){
        
        const imageUrl = `${image_base_url}${image_file_names[i]}`;
        
        const detectImageResult = await detectImage(imageUrl);
        console.log("pushing " + i);
        results.push(detectImageResult);
    }
    
    return results;
}

processImageList.then(results => {
    console.log (JSON.stringify(results));
}).catch(err => {
    console.log(err);
})