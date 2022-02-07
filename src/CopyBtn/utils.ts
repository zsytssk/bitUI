let textArea: HTMLTextAreaElement;

const isIOS = () => {
  return navigator.userAgent.match(/ipad|iphone/i);
};
const isPc = () => {
  return String.prototype.toLowerCase.call(navigator.platform) === 'win32' || /^Mac/i.test(navigator.platform);
};

function createTextArea(text: string) {
  textArea = document.createElement('textArea') as HTMLTextAreaElement;
  textArea.value = text;
  document.body.appendChild(textArea);
}
function selectText() {
  let range, selection;

  if (isIOS() && !isPc()) {
    range = document.createRange();
    range.selectNodeContents(textArea);
    selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
    textArea.setSelectionRange(0, 999999);
  } else {
    textArea.select();
  }
}

function copy(text: string): Promise<void> {
  createTextArea(text);
  selectText();
  return new Promise((resove, reject) => {
    try {
      if (document.execCommand('Copy')) {
        resove();
      } else {
        reject();
      }
    } catch (err) {
      reject();
    }
    document.body.removeChild(textArea);
  });
}

export { copy };
