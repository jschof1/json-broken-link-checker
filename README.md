# Adapt JSON Broken Link Checker

This is a simple, yet powerful tool that helps you find broken links within your Adapt JSON course content. It scans through the JSON input, identifies broken links, and provides you with an option to replace them with new, working links.

## Features

- Scans JSON input for broken links
- Displays the context of each broken link
- Allows you to replace broken links with new ones
- Generates updated JSON output with the new links

## Usage

1. Open the `index.html` file in a web browser.
2. Copy and paste your Adapt JSON content into the input field.
3. Click the "Check Links" button to begin the scanning process.
4. Review the list of broken links and their context.
5. If you want to keep the original link, check the "Keep original link" checkbox. Otherwise, uncheck the checkbox and enter a new, working link in the input field.
6. Click the "Replace Links" button to update the JSON content with the new links.
7. The updated JSON content will be displayed in the output field. Copy the updated JSON and replace the original JSON in your Adapt course.

## Limitations

- The tool does not support JSON input with deeply nested objects or arrays.
- The tool might not work properly with CORS-protected websites or links that require authentication.

## License

This project is open source and available under the [MIT License](https://opensource.org/licenses/MIT).
