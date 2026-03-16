const { GoogleGenAI } =require( "@google/genai");

const ai = new GoogleGenAI({ apiKey: "AIzaSyATV4q3Wm_yZZeTrJW389oWUOca0NLnBmE" });

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "Is raning in bhubaneswar, if answer is yes the return 1 or if no the return answer 0",
  });
 console.log(response.text)
   let ans=response.text;
   if(ans==0){
    console.log("No extra charge")
   }else if(ans==1){
    console.log("Extra charge is added")
   }else{
      console.log("Nothing")
   }
}

main();