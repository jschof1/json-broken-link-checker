import './style.css';

const jsonInput = document.getElementById('jsonInput');
const checkLinksBtn = document.getElementById('checkLinksBtn');
const brokenLinksContainer = document.getElementById('brokenLinksContainer');
const replaceLinksBtn = document.getElementById('replaceLinksBtn');
let originalJson;

checkLinksBtn.addEventListener('click', async () => {
  try {
    originalJson = JSON.parse(jsonInput.value);
  } catch (err) {
    alert('Invalid JSON. Please check your input.');
    return;
  }

  for (const obj of originalJson) {
    processBody(obj);

    if (Array.isArray(obj._items)) {
      for (const item of obj._items) {
        processBody(item);
      }
    }
  }

  if (brokenLinksContainer.children.length > 0) {
    replaceLinksBtn.disabled = false;
  }
});

async function processBody(obj) {
  const body = obj.body;
  const links = body.match(/https?:\/\/[^ "\]]+/g) || [];

  for (const link of links) {
    console.log(link);
    try {
      const response = await fetch(link, { method: 'HEAD', mode: 'no-cors' });

      if (!response.ok && response.type !== 'opaque')
        throw new Error('Broken link');

      if (response.type !== 'opaque') {
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('text/html')) {
          throw new Error('Not a web page');
        }

        const pageResponse = await fetch(link);
        const pageText = await pageResponse.text();
        const titleMatch = pageText.match(/<title>(.*?)<\/title>/i);
        const title = titleMatch ? titleMatch[1] : '';
        const metaMatch = pageText.match(/<meta[^>]*description[^>]*>/i);
        const metaDescription = metaMatch ? metaMatch[0] : '';
        if (
          !title ||
          title === '404' ||
          title.toLowerCase().includes('not found') ||
          title.toLowerCase().includes('error')
        ) {
          throw new Error('Dead link');
        }

        if (
          !metaDescription ||
          metaDescription.toLowerCase().includes('not found') ||
          metaDescription.toLowerCase().includes('error')
        ) {
          throw new Error('Dead link');
        }
      }
    } catch (err) {
      console.error(err.message); // Log the error message for debugging
      addBrokenLink(link, obj);
    }
  }
}

brokenLinksContainer.addEventListener('change', (e) => {
  if (e.target.classList.contains('keep-original-link')) {
    const input = e.target.parentElement.nextElementSibling;
    input.disabled = e.target.checked;
  }
});

function addBrokenLink(link, obj) {
  const div = document.createElement('div');
  div.classList.add('link-container');
  div.innerHTML = `
      <p>Broken link: <a target="_blank" href="${link}"> ${link} </a> </p>
      <label>
          <input type="checkbox" data-original-link="${link}" class="keep-original-link" checked>
          Keep original link
      </label>
      <input type="text" data-original-link="${link}" data-object-index="${originalJson.indexOf(
    obj
  )}" placeholder="New link" disabled>
  `;
  brokenLinksContainer.appendChild(div);
}

replaceLinksBtn.addEventListener('click', () => {
  const inputs = brokenLinksContainer.querySelectorAll('input[type="text"]');
  inputs.forEach((input) => {
    const oldLink = input.getAttribute('data-original-link');
    const newLink = input.value;
    const objIndex = parseInt(input.getAttribute('data-object-index'), 10);
    const keepOriginalLinkCheckbox = input.parentElement.querySelector(
      '.keep-original-link'
    );

    if (!keepOriginalLinkCheckbox.checked && newLink) {
      originalJson[objIndex].body = originalJson[objIndex].body.replace(
        oldLink,
        newLink
      );
    }
  });

  const updatedJsonOutput = document.getElementById('updatedJsonOutput');
  updatedJsonOutput.value = JSON.stringify(originalJson, null, 2);
});
