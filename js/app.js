const templates = [
    (name) => `Happy Birthday, ${name}! May today be packed with bright laughter, joyful memories, and the people who love you most.`,
    (name) => `${name}, here's to a new year of adventures, cosy nights in, and the kind of happiness that sticks around.`,
    (name) => `Celebrating you today, ${name}! I hope the next twelve months bring easy smiles, little wins, and big, bold dreams.`,
    (name) => `Happy Birthday, ${name}! You make every space warmer just by being there—cheers to another unforgettable year.`,
    (name) => `${name}, wishing you cake, confetti, and those heart-hugging moments that remind you how loved you are.`,
    (name) => `It's your day, ${name}! May it overflow with people who cherish you and stories you'll be telling for ages.`,
    (name) => `To the wonderful ${name}: keep shining, keep laughing, and keep being exactly who you are.`,
    (name) => `Have the happiest birthday, ${name}! Here's to restful mornings, thrilling adventures, and everything in between.`,
    (name) => `${name}, sending you birthday magic, favourite songs on repeat, and a year that fits you just right.`
];

const screens = {
    form: document.querySelector('[data-screen="form"]'),
    gift: document.querySelector('[data-screen="gift"]'),
    message: document.querySelector('[data-screen="message"]')
};

const form = document.querySelector('.wish-form');
const nameInput = document.querySelector('#birthday-name');
const recipientFields = document.querySelectorAll('[data-recipient]');
const messageOutput = document.querySelector('[data-message]');
const giftButton = document.querySelector('[data-open-gift]');
const copyButton = document.querySelector('[data-copy]');
const startOverButton = document.querySelector('[data-start-over]');
const errorMessage = document.querySelector('.form-error');

let lastTemplateIndex = null;
let currentMessage = '';

const capitaliseName = (value) =>
    value
        .trim()
        .replace(/\s+/g, ' ')
        .split(' ')
        .filter(Boolean)
        .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1).toLowerCase())
        .join(' ');

const pickTemplate = () => {
    if (templates.length === 1) {
        return { template: templates[0], index: 0 };
    }

    let index = Math.floor(Math.random() * templates.length);
    while (index === lastTemplateIndex) {
        index = Math.floor(Math.random() * templates.length);
    }

    return { template: templates[index], index };
};

const setRecipient = (name) => {
    recipientFields.forEach((field) => {
        field.textContent = name;
    });
};

const setMessage = (text) => {
    messageOutput.textContent = text;
};

const handleError = (hasError) => {
    if (hasError) {
        errorMessage.hidden = false;
        nameInput.setAttribute('aria-invalid', 'true');
    } else {
        errorMessage.hidden = true;
        nameInput.removeAttribute('aria-invalid');
    }
};

const showScreen = (target) => {
    Object.entries(screens).forEach(([key, section]) => {
        if (key === target) {
            section.hidden = false;
        } else {
            section.hidden = true;
        }
    });
};

const generateMessage = () => {
    const cleaned = capitaliseName(nameInput.value);

    if (!cleaned) {
        handleError(true);
        nameInput.focus();
        return false;
    }

    handleError(false);

    const { template, index } = pickTemplate();
    lastTemplateIndex = index;

    currentMessage = template(cleaned);

    setRecipient(cleaned);
    setMessage('');

    return true;
};

form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (generateMessage()) {
        showScreen('gift');
        giftButton.focus();
    }
});

nameInput.addEventListener('input', () => {
    if (nameInput.value.trim()) {
        handleError(false);
    }
});

giftButton.addEventListener('click', () => {
    if (!currentMessage) {
        return;
    }

    setMessage(currentMessage);
    showScreen('message');
    copyButton.focus();
});

copyButton.addEventListener('click', async () => {
    if (!currentMessage) {
        copyButton.blur();
        return;
    }

    const originalText = copyButton.textContent;

    try {
        await navigator.clipboard.writeText(currentMessage);
        copyButton.textContent = 'Copied!';
        copyButton.disabled = true;
        setTimeout(() => {
            copyButton.textContent = originalText;
            copyButton.disabled = false;
        }, 1500);
    } catch (error) {
        copyButton.textContent = 'Press Ctrl+C to copy';
        setTimeout(() => {
            copyButton.textContent = originalText;
        }, 2000);
    }
});

startOverButton.addEventListener('click', () => {
    currentMessage = '';
    nameInput.value = '';
    setMessage('');
    handleError(false);
    showScreen('form');
    nameInput.focus();
});
