# Kode
Kode is a Chrome extension designed to simplify LeetCode and browser tasks. Built for the **Google Chrome Built-in AI Challenge**, aims to enhance productivity and learning by leveraging the power of Google Gemini Nano. Whether you're solving coding problems, taking notes, or staying focused, Kode makes everything seamless—all on your device, with no external dependencies.  

## Demo Video

Check out the demo video of Kode in action!  
[Watch the Demo Video on Devpost.com](https://devpost.com/software/kode-zie2w9)

This video demonstrates how the extension works, and its features.

## Features

### **DSA Tool**
- With the help of the Prompt API built into the browser, the tool helps the user think in the right direction by providing small, helpful hints regarding the question.

### **Language Toggle**
- Thanks to the built-in Translation API the user can toggle between different languages. This makes the Leetcode website more accessible with just a click. 

### **Notes Tool**
- The tool is made for the users to take down notes regarding the question, with the question summary and tags for the question generated by AI on the device.

### **Focus Center**
- The Prompt API analyzes the user’s objective and the URL of the current page.
- It checks if the website aligns with the user’s goal and notifies them if it doesn’t.
- For YouTube videos, the Kode evaluates the title to assess relevance to the user’s objective.

### **AI Mate**
- Open websites with natural language requests.
- Intelligently picks the right tool for your query and fetches accurate results from the internet.

### **Quick Recommendations**
- The prompt API generates quick Leetcode question recommendations with direct links which further are shown to the user. 


## Installation

1. Clone the repository:
   ```bash
   https://github.com/GurneeshBudhiraja/Kode-Chrome-Extension.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Kode-Chrome-Extension
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Build the extension:
   ```bash
   npm run build
   ```
5. Load the extension in Chrome Canary:
- Open Chrome Canary and navigate to chrome://extensions/.
- Enable Developer Mode by toggling the switch in the top-right corner.
- Click Load unpacked and select the dist folder from the Kode-Chrome-Extension directory.
- If the required models are not downloaded or if you encounter any issues, please refer to [this document](https://docs.google.com/document/d/18otm-D9xhn_XyObbQrc1v7SI-7lBX3ynZkjEpiS1V04/edit?pli=1&tab=t.0) for troubleshooting and further guidance.



## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
