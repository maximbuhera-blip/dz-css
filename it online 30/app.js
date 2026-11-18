class Book {
    constructor(title, author, pages) {
      if (!Number.isInteger(pages) || pages < 1) {
        throw new Error("Кількість сторінок має бути цілим числом від 1.");
      }
      this.title = title;
      this.author = author;
      this.pages = pages;
      this.current_page = 1;
    }
  
    show_info() {
      return `Назва: ${this.title}\nАвтор: ${this.author}\nСторінок: ${this.pages}\nПоточна сторінка: ${this.current_page}`;
    }
  
    read_page() {
      return this.read_pages(1);
    }
  
    read_pages(count) {
      if (!Number.isInteger(count) || count < 0) {
        throw new Error("Введіть ціле невід'ємне число сторінок.");
      }
      this.current_page = Math.min(this.current_page + count, this.pages);
      return this.current_page;
    }
  
    restart() {
      this.current_page = 1;
      return this.current_page;
    }
  
    progress() {
      if (this.pages === 1) return 100;
      return ((this.current_page - 1) / (this.pages - 1)) * 100;
    }
  }
  
  class City {
    constructor(name, region, country, population, postalCode, phoneCode) {
      if (!Number.isFinite(population) || population < 0) {
        throw new Error("Кількість жителів не може бути від'ємною.");
      }
      this.name = name;
      this.region = region;
      this.country = country;
      this.population = population;
      this.postalCode = postalCode;
      this.phoneCode = phoneCode;
    }
  
    show_info() {
      return `Місто: ${this.name}\nРегіон: ${this.region}\nКраїна: ${this.country}\nЖителів: ${this.population}\nПоштовий індекс: ${this.postalCode}\nТелефонний код: ${this.phoneCode}`;
    }
  
    change_population(difference) {
      const newPopulation = this.population + difference;
      if (!Number.isFinite(newPopulation) || newPopulation < 0) {
        throw new Error("Кількість жителів не може бути від'ємною.");
      }
      this.population = newPopulation;
    }
  }
  
  class Country {
    constructor(name, continent, population, phoneCode, capital, cities) {
      if (!Number.isFinite(population) || population < 0) {
        throw new Error("Кількість жителів не може бути від'ємною.");
      }
      this.name = name;
      this.continent = continent;
      this.population = population;
      this.phoneCode = phoneCode;
      this.capital = capital;
      this.cities = cities;
    }
  
    show_info() {
      const cityNames = this.cities.length > 0 ? this.cities.join(", ") : "не вказані";
      return `Країна: ${this.name}\nКонтинент: ${this.continent}\nЖителів: ${this.population}\nТелефонний код: ${this.phoneCode}\nСтолиця: ${this.capital}\nМіста: ${cityNames}`;
    }
  
    add_city(cityName) {
      if (cityName && !this.cities.includes(cityName)) {
        this.cities.push(cityName);
      }
    }
  
    remove_city(cityName) {
      this.cities = this.cities.filter((city) => city !== cityName);
    }
  }
  
  const STORAGE_KEYS = {
    books: "classTask.books",
    city: "classTask.city",
    country: "classTask.country"
  };
  
  function loadFromStorage(key, defaultValue) {
    try {
      const savedValue = localStorage.getItem(key);
      return savedValue === null ? defaultValue : JSON.parse(savedValue);
    } catch (error) {
      return defaultValue;
    }
  }
  
  function saveToStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      return false;
    }
  }
  
  const bookDefaults = [
    new Book("Кобзар", "Тарас Шевченко", 240),
    new Book("Лісова пісня", "Леся Українка", 96)
  ];
  
  const savedBookPages = loadFromStorage(STORAGE_KEYS.books, []);
  
  const books = bookDefaults.map((book, index) => {
    const savedPage = Array.isArray(savedBookPages) ? savedBookPages[index] : null;
  
    if (Number.isInteger(savedPage) && savedPage >= 1 && savedPage <= book.pages) {
      book.current_page = savedPage;
    }
  
    return book;
  });
  
  function saveBooks() {
    saveToStorage(STORAGE_KEYS.books, books.map((book) => book.current_page));
  }
  
  function renderBooks() {
    const booksContainer = document.getElementById("books");
    booksContainer.innerHTML = "";
  
    books.forEach((book) => {
      const card = document.createElement("div");
      card.className = "card";
  
      const title = document.createElement("h3");
      title.textContent = book.title;
  
      const info = document.createElement("p");
      info.className = "info";
      info.textContent = book.show_info();
  
      const progress = document.createElement("progress");
      progress.max = 100;
      progress.value = book.progress();
  
      const progressText = document.createElement("p");
      progressText.textContent = `Прогрес: ${book.progress().toFixed(1)}%`;
  
      const countInput = document.createElement("input");
      countInput.type = "number";
      countInput.min = 0;
      countInput.value = 5;
      countInput.setAttribute("aria-label", "Скільки сторінок прочитати");
  
      const nextButton = document.createElement("button");
      nextButton.textContent = "Наступна сторінка";
      nextButton.onclick = () => {
        book.read_page();
        saveBooks();
        renderBooks();
      };
  
      const readButton = document.createElement("button");
      readButton.textContent = "Читати сторінки";
      readButton.onclick = () => {
        const count = Number(countInput.value);
        if (Number.isInteger(count) && count >= 0) {
          book.read_pages(count);
          saveBooks();
          renderBooks();
        }
      };
  
      const restartButton = document.createElement("button");
      restartButton.textContent = "Почати спочатку";
      restartButton.className = "secondary";
      restartButton.onclick = () => {
        book.restart();
        saveBooks();
        renderBooks();
      };
  
      card.append(
        title,
        info,
        progress,
        progressText,
        countInput,
        nextButton,
        readButton,
        restartButton
      );
  
      booksContainer.appendChild(card);
    });
  }
  
  renderBooks();
  
  function createDefaultCity() {
    return new City("Львів", "Львівська область", "Україна", 717273, "79000", "+380 32");
  }
  
  function loadCity() {
    const savedCity = loadFromStorage(STORAGE_KEYS.city, null);
  
    if (!savedCity) {
      return createDefaultCity();
    }
  
    try {
      return new City(
        savedCity.name,
        savedCity.region,
        savedCity.country,
        Number(savedCity.population),
        savedCity.postalCode,
        savedCity.phoneCode
      );
    } catch (error) {
      return createDefaultCity();
    }
  }
  
  let city = loadCity();
  
  const cityForm = document.getElementById("city-form");
  cityForm.elements["name"].value = city.name;
  cityForm.elements["region"].value = city.region;
  cityForm.elements["country"].value = city.country;
  cityForm.elements["population"].value = city.population;
  cityForm.elements["postalCode"].value = city.postalCode;
  cityForm.elements["phoneCode"].value = city.phoneCode;
  
  function saveCity() {
    saveToStorage(STORAGE_KEYS.city, city);
  }
  
  function renderCity() {
    document.getElementById("city-output").textContent = city.show_info();
  }
  
  renderCity();
  
  document.getElementById("city-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
  
    try {
      city = new City(
        form.elements["name"].value.trim(),
        form.elements["region"].value.trim(),
        form.elements["country"].value.trim(),
        Number(form.elements["population"].value),
        form.elements["postalCode"].value.trim(),
        form.elements["phoneCode"].value.trim()
      );
  
      saveCity();
      renderCity();
      document.getElementById("city-status").textContent = "Дані міста оновлено.";
    } catch (error) {
      document.getElementById("city-status").textContent = error.message;
    }
  });
  
  document.getElementById("population-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const difference = Number(event.currentTarget.elements["difference"].value);
  
    try {
      city.change_population(difference);
      saveCity();
      renderCity();
      document.getElementById("city-status").textContent = "Кількість жителів змінено.";
    } catch (error) {
      document.getElementById("city-status").textContent = error.message;
    }
  });
  
  function createDefaultCountry() {
    return new Country(
      "Україна",
      "Європа",
      36700000,
      "+380",
      "Київ",
      ["Київ", "Львів", "Одеса"]
    );
  }
  
  function loadCountry() {
    const savedCountry = loadFromStorage(STORAGE_KEYS.country, null);
  
    if (!savedCountry || !Array.isArray(savedCountry.cities)) {
      return createDefaultCountry();
    }
  
    try {
      return new Country(
        savedCountry.name,
        savedCountry.continent,
        Number(savedCountry.population),
        savedCountry.phoneCode,
        savedCountry.capital,
        savedCountry.cities
      );
    } catch (error) {
      return createDefaultCountry();
    }
  }
  
  let country = loadCountry();
  
  const countryForm = document.getElementById("country-form");
  countryForm.elements["name"].value = country.name;
  countryForm.elements["continent"].value = country.continent;
  countryForm.elements["population"].value = country.population;
  countryForm.elements["phoneCode"].value = country.phoneCode;
  countryForm.elements["capital"].value = country.capital;
  countryForm.elements["cities"].value = country.cities.join(", ");
  
  function saveCountry() {
    saveToStorage(STORAGE_KEYS.country, country);
  }
  
  function renderCountry() {
    document.getElementById("country-output").textContent = country.show_info();
  }
  
  renderCountry();
  
  document.getElementById("country-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
  
    const cities = form.elements["cities"].value
      .split(",")
      .map((cityName) => cityName.trim())
      .filter((cityName) => cityName !== "");
  
    try {
      country = new Country(
        form.elements["name"].value.trim(),
        form.elements["continent"].value.trim(),
        Number(form.elements["population"].value),
        form.elements["phoneCode"].value.trim(),
        form.elements["capital"].value.trim(),
        cities
      );
  
      saveCountry();
      renderCountry();
      document.getElementById("country-status").textContent = "Дані країни оновлено.";
    } catch (error) {
      document.getElementById("country-status").textContent = error.message;
    }
  });
  
  document.getElementById("country-city-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const cityName = event.currentTarget.elements["cityName"].value.trim();
  
    country.add_city(cityName);
    saveCountry();
    renderCountry();
    document.getElementById("country-status").textContent = `Місто «${cityName}» додано.`;
  });
  
  document.getElementById("remove-city").addEventListener("click", () => {
    const cityName = document
      .getElementById("country-city-form")
      .elements["cityName"].value.trim();
  
    country.remove_city(cityName);
    saveCountry();
    renderCountry();
    document.getElementById("country-status").textContent =
      `Місто «${cityName}» видалено, якщо воно було у списку.`;
  });