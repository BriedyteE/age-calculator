const form = document.querySelector(".date-form");
const inputs = form.querySelectorAll("input");
const invalidDateText = form.querySelector(".error-text.form");

inputs.forEach((input) =>
  input.addEventListener("focus", () => {
    invalidDateText.classList.remove("visible");
    const inputWrappers = form.querySelectorAll(".input-items");

    inputWrappers.forEach((wrapper) => wrapper.classList.remove("error"));
  })
);

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
      form.querySelector(`[data-id="${field}"]`).className += " error";
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
    validationDate.day === Number(day) &&
    validationDate.month === Number(month) &&
    validationDate.year === Number(year)
  );
};

const calculateAge = (birthDay, birthMonth, birthYear) => {
  const currDate = new Date();
  const { day, month, year } = getDateData(currDate);

  const isBdayPassedThisYear = new Date(
    currDate.getFullYear(),
    birthMonth,
    birthDay
  );

  const monthDiff = month - birthMonth;
  const dayDiff = day - birthDay;
  const daysInLastMonth = new Date(year, month, 0).getDate();

  console.log();

  return {
    day: dayDiff < 0 ? dayDiff + daysInLastMonth : dayDiff,
    month: monthDiff < 0 ? monthDiff + 12 : monthDiff,
    year: isBdayPassedThisYear ? year - birthYear : year - birthYear - 1,
  };
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = [...new FormData(e.target).entries()];
  const isVaid = validateFields(data);

  if (!isVaid) {
    return;
  }

  const { day, month, year } = data.reduce(
    (acc, [key, value]) => ({ ...acc, [key]: value }),
    {}
  );
  const isDateValid = validateDate(day, month - 1, year);

  if (!isDateValid) {
    invalidDateText.className += " visible";
    return;
  }

  const calculatedAge = calculateAge(day, month - 1, year);
  const resultsText = document.querySelectorAll(".result");

  resultsText.forEach((restult) => {
    restult.textContent = calculatedAge[restult.getAttribute("data-id")];
  });
});
