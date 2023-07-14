const form = document.querySelector(".date-form");
const inputs = form.querySelectorAll("input");

let itemsWithErrorClass = [];

const removeFormErrors = () =>
  itemsWithErrorClass.forEach((item) => item.classList.remove("error"));

inputs.forEach((input) => input.addEventListener("focus", removeFormErrors));

const validateFields = (values) => {
  const validatioMap = {
    day: (day) => day && day > 0 && day < 32,
    month: (month) => month && month > 0 && month < 13,
    year: (year) => year && year <= new Date().getFullYear(),
  };
  let isVaid = true;

  values.forEach(([field, value]) => {
    const isValidField = validatioMap[field](value);

    if (!isValidField) {
      const fieldWrapper = form.querySelector(`[data-id="${field}"]`);
      fieldWrapper.className += " error";
      itemsWithErrorClass.push(fieldWrapper);
      isVaid = false;
    }
  });

  return isVaid;
};

const getDateData = (date) => {
  return {
    day: date.getDate(),
    month: date.getMonth(),
    year: date.getFullYear(),
  };
};

const validateDate = (day, month, year) => {
  const date = new Date(year, month, day);
  const validationDate = getDateData(date);

  return (
    validationDate.day === day &&
    validationDate.month === month &&
    validationDate.year === year
  );
};

const calculateAge = (birthDay, birthMonth, birthYear) => {
  const currDate = new Date();
  const curr = getDateData(currDate);

  const isBdayPassedThisYear =
    new Date(curr.year, birthMonth, birthDay) < currDate;
  const daysCountInBdayMonth = new Date(curr.year, birthMonth + 1, 0).getDate();
  const totalDaysInPartialMonths = daysCountInBdayMonth - birthDay + curr.day;

  const getMonth = () => {
    const monthDiff = isBdayPassedThisYear
      ? 12 - curr.month - birthMonth
      : curr.month - birthMonth + 12;

    return totalDaysInPartialMonths >= daysCountInBdayMonth
      ? monthDiff
      : monthDiff - 1;
  };

  return {
    year: isBdayPassedThisYear
      ? curr.year - birthYear
      : curr.year - birthYear - 1,
    month: getMonth(),
    day:
      totalDaysInPartialMonths >= daysCountInBdayMonth
        ? totalDaysInPartialMonths - daysCountInBdayMonth
        : totalDaysInPartialMonths,
  };
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  removeFormErrors();
  const data = [...new FormData(e.target).entries()];
  const isVaid = validateFields(data);

  if (!isVaid) {
    return;
  }

  const { day, month, year } = data.reduce(
    (acc, [key, value]) => ({ ...acc, [key]: Number(value) }),
    {}
  );
  const isDateValid = validateDate(day, month - 1, year);

  if (!isDateValid) {
    const invalidDateParagraph = form.querySelector(".error-text.all-fields");
    invalidDateParagraph.className += " error";
    itemsWithErrorClass.push(invalidDateParagraph);
    return;
  }

  const calculatedAge = calculateAge(day, month - 1, year);
  const resultsText = document.querySelectorAll(".result");

  resultsText.forEach((restult) => {
    restult.textContent = calculatedAge[restult.getAttribute("data-id")];
  });
});
