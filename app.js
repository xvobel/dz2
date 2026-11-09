const sourceJson = `{
  "event": {
    "title": "Ночь в музее",
    "date": "15 ноября, 18:30",
    "place": "Музей космонавтики, проспект Мира, 111",
    "description": "Вечерняя программа с выставкой и экскурсиями",
    "meeting": "Сбор: 18:30. Начало: 19:00."
  },
  "services": [
    { "id": "guide", "title": "  Экскурсия с гидом  ", "price": 500 },
    { "id": "audio", "title": "Аудиогид", "price": 350 },
    { "id": "catalog", "title": "Каталог выставки", "price": 250 }
  ]
}`;

let data;
try {
  data = JSON.parse(sourceJson);
  document.querySelector('#service-form').hidden = false;
} catch (error) {
  document.querySelector('#data-error').hidden = false;
  document.querySelector('#service-form').hidden = true;
}

function buildReport(services, guideChecked, audioChecked, catalogChecked) {
  const selectedServices = services.filter(service => {
    if (service.id === 'guide' && guideChecked) return true;
    if (service.id === 'audio' && audioChecked) return true;
    if (service.id === 'catalog' && catalogChecked) return true;
    return false;
  });

  if (selectedServices.length === 0) {
    return { count: 0, total: 0, items: [] };
  }

  const items = selectedServices.map(({ title, price }) => {
    return {
      title: title.trim(),
      price: price
    };
  });

  const total = items.reduce((sum, item) => sum + item.price, 0);

  return {
    count: items.length,
    total: total,
    items: items
  };
}

const form = document.querySelector('#service-form');

form.addEventListener('submit', function(event) {
  event.preventDefault();

  const guideChecked = form.querySelector('input[name="guide"]').checked;
  const audioChecked = form.querySelector('input[name="audio"]').checked;
  const catalogChecked = form.querySelector('input[name="catalog"]').checked;

  const report = buildReport(data.services, guideChecked, audioChecked, catalogChecked);

  const choiceError = document.querySelector('#choice-error');
  const resultBlock = document.querySelector('#result');
  const jsonBlock = document.querySelector('#report-json');

  if (report.count === 0) {
    choiceError.hidden = false;
    resultBlock.hidden = true;
    jsonBlock.hidden = true;
  } else {
    choiceError.hidden = true;

    // Исправление 1: используем join, чтобы не было лишнего <br> в конце
    const titles = report.items.map(function(item) {
      return item.title;
    });

    let resultHTML = `Выбрано услуг: ${report.count}<br>`;
    resultHTML += `Итого: ${report.total} руб.<br>`;
    resultHTML += titles.join('<br>');

    resultBlock.innerHTML = resultHTML;
    resultBlock.hidden = false;

    const reportJsonString = JSON.stringify(report);
    JSON.parse(reportJsonString); // Проверка валидности строки по ТЗ
    jsonBlock.textContent = reportJsonString;
    jsonBlock.hidden = false;
  }
});

const showProgramBtn = document.querySelector('#show-program');
const programBlock = document.querySelector('#program');

showProgramBtn.addEventListener('click', function() {
  // Исправление 2: защита от ошибки, если JSON был повреждён при загрузке
  if (!data) return; 
  
  programBlock.hidden = false;
  programBlock.innerHTML = data.event.meeting;
});