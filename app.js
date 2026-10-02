const SHEET_ID = "1ZxfAGaLTjWE5CSpdpi2v8UMN4XS_zi6ov9Yr2X7OiCk";
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq`;
const ATTENDANCE_ID = "1GaMh4GIfanzEvJYpbtvuVLpawERz_-kRzSrWyqovpXs";
const ATTENDANCE_URL = `https://docs.google.com/spreadsheets/d/${ATTENDANCE_ID}/gviz/tq`;
const numberFormat = new Intl.NumberFormat("en-US");
const dateInput = document.querySelector("#reportDate");
const workStartInput = document.querySelector("#workStartTime");
const workEndInput = document.querySelector("#workEndTime");
const state = { sorting: [], staging: [], attendance: new Map(), activeView: "overview", loaded: false, error: null };
const translations = {
  ar: {
    brandTitle: "مؤشر الإنتاجية", brandSubtitle: "لوحة متابعة العمليات", sections: "الأقسام",
    languageSelect: "اختيار اللغة",
    sorting: "السورتينج", staging: "الـ staging", connected: "متصل ببيانات الشيت",
    operations: "العمليات", teamPerformance: "متابعة أداء الفريق",
    overview: "نظرة عامة", overviewTitle: "لوحة الإنتاجية",
    overviewSubtitle: "ملخص إنتاج السورتينج والـ staging في التاريخ المحدد.",
    overviewSortingCaption: "من السورتينج في التاريخ المحدد",
    overviewStagingCaption: "عدد التوت الفريدة في staging",
    activeEmployees: "موظفون نشطون",
    overviewEmployeeCaption: "في السورتينج والـ staging",
    overviewHourlyTitle: "حركة السورتينج بالساعة",
    overviewHourlyCaption: "إجمالي القطع المكتملة خلال كل ساعة.",
    topSorters: "أعلى sorters إنتاجًا",
    topSortersCaption: "ترتيب حسب إجمالي القطع المسورتة.",
    topStagers: "أعلى موظفي staging إنتاجًا",
    topStagersCaption: "ترتيب حسب عدد التوت الفريدة.",
    viewDetails: "عرض التفاصيل",
    unitsPieces: "قطعة", unitsContainers: "توت",
    sortingTitle: "أداء السورتينج", stagingTitle: "أداء الـ staging",
    sortingSubtitle: "إنتاج كل sorter موزّع على ساعات العمل.",
    stagingSubtitle: "عدد التوت المسجلة لكل موظف في الـ staging.",
    reportDate: "تاريخ التقرير", workHours: "وقت العمل", fromTime: "من الساعة", toTime: "إلى الساعة",
    workHoursHint: "الساعتان مشمولتان، والنهاية الأسبق تعبر لليوم التالي",
    loading: "بنحمّل بيانات الشيت...",
    sortingProductivity: "إنتاجية السورتينج", sortedTotal: "إجمالي القطع المسورتة",
    sortedQtyCaption: "sorted_qty خلال اليوم المحدد", sorterCount: "عدد الـ sorters",
    sorterCountCaption: "موظفين لديهم إنتاج مسجل", peakHour: "أعلى ساعة إنتاجًا",
    peakHourTotal: "{count} قطعة في الساعة", noCompletedTasks: "لا توجد مهام مكتملة",
    sortingByHour: "إنتاج كل sorter بالساعة",
    sortingByHourCaption: "الكمية محسوبة حسب ساعة إكمال مهمة السورتينج.",
    searchSorter: "ابحث عن sorter", noSortingData: "مفيش بيانات سورتينج للتاريخ ده",
    chooseAnotherDate: "اختار تاريخ تاني أو حدّث البيانات.",
    sortingHeader: "الـ sorter", rank: "#", total: "إجمالي sorted_qty", skippedQty: "إجمالي skipped_qty",
    sortingFooterCount: "{count} sorter", totalPieces: "إجمالي sorted_qty: {count} قطعة", totalSkipped: "إجمالي skipped_qty: {count}",
    stagingProductivity: "إنتاجية الـ staging", containerTotal: "إجمالي التوت",
    uniqueContainerTotal: "عدد التوت الفريدة",
    stagerCount: "عدد موظفي staging", stagerCountCaption: "موظفين لديهم توت مسجل",
    topProduction: "أعلى إنتاج", topStagerCount: "{count} توت",
    noStagingRecords: "لا توجد سجلات staging", containersPerEmployee: "التوت لكل موظف",
    containersPerEmployeeCaption: "عدد التوت الفريدة لكل موظف staging في التاريخ المحدد.",
    searchEmployee: "ابحث عن موظف", employee: "الموظف", containerCount: "عدد التوت",
    shareOfTotal: "نسبة من الإجمالي", noStagingData: "مفيش بيانات staging للتاريخ ده",
    stagingFooterCount: "{count} موظف", totalContainers: "إجمالي التوت: {count}",
    dataSource: "مصدر البيانات: Google Sheets", calculatedFromSheet: "يتم احتساب الإنتاج من سجلات الشيت",
    downloadExcel: "تحميل Excel", refresh: "تحديث البيانات",
    dayShift: "الوضع النهاري", nightShift: "الوضع الليلي",
    loadError: "ما قدرناش نحمّل البيانات: {details} تأكد إن الشيت متاح للعرض عبر الرابط، وبعدها جرّب التحديث.",
    exportError: "ما قدرناش ننزّل ملف Excel: {details}",
    noDataLoaded: "لسه بيانات الشيت ما اتحمّلتش.",
    noExcelLibrary: "مكتبة إنشاء ملف Excel مش متاحة. اتأكد من اتصال الإنترنت وحاول تاني.",
    sortingSheetName: "السورتينج", stagingSheetName: "Staging", summarySheetName: "ملخص",
    reportTitle: "تقرير إنتاجية العمليات", department: "القسم",
    employeeCount: "عدد الموظفين", outputTotal: "إجمالي الإنتاج",
    highestSortingHour: "أعلى ساعة سورتينج", employeeName: "اسم الموظف",
    username: "username", totalQuantity: "الإجمالي (قطعة)",
    uniqueContainers: "عدد التوت الفريدة", percentageTotal: "النسبة من الإجمالي",
  },
  en: {
    brandTitle: "Productivity Tracker", brandSubtitle: "Operations dashboard", sections: "Sections",
    languageSelect: "Select language",
    sorting: "Sorting", staging: "Staging", connected: "Connected to sheet data",
    operations: "Operations", teamPerformance: "Team performance",
    overview: "Overview", overviewTitle: "Productivity overview",
    overviewSubtitle: "Sorting and staging output for the selected date.",
    overviewSortingCaption: "From sorting on the selected date",
    overviewStagingCaption: "Unique staged totes",
    activeEmployees: "Active employees",
    overviewEmployeeCaption: "Across sorting and staging",
    overviewHourlyTitle: "Hourly sorting activity",
    overviewHourlyCaption: "Total items completed in each hour.",
    topSorters: "Top sorters",
    topSortersCaption: "Ranked by total items sorted.",
    topStagers: "Top staging employees",
    topStagersCaption: "Ranked by unique totes staged.",
    viewDetails: "View details",
    unitsPieces: "items", unitsContainers: "totes",
    sortingTitle: "Sorting performance", stagingTitle: "Staging performance",
    sortingSubtitle: "Each sorter's output, broken down by hour.",
    stagingSubtitle: "Totes registered by each staging employee.",
    reportDate: "Report date", workHours: "Work hours", fromTime: "From", toTime: "To",
    workHoursHint: "Both hours are included; an earlier end time continues into the next day.",
    loading: "Loading sheet data...",
    sortingProductivity: "Sorting productivity", sortedTotal: "Total items sorted",
    sortedQtyCaption: "sorted_qty for the selected date", sorterCount: "Sorters",
    sorterCountCaption: "Employees with recorded output", peakHour: "Most productive hour",
    peakHourTotal: "{count} items during this hour", noCompletedTasks: "No completed jobs",
    sortingByHour: "Hourly output by sorter",
    sortingByHourCaption: "Quantities are grouped by the job completion hour.",
    searchSorter: "Search sorters", noSortingData: "No sorting data for this date",
    chooseAnotherDate: "Choose another date or refresh the data.",
    sortingHeader: "Sorter", rank: "#", total: "Total sorted_qty", skippedQty: "Total skipped_qty",
    sortingFooterCount: "{count} sorters", totalPieces: "Total sorted_qty: {count} items", totalSkipped: "Total skipped_qty: {count}",
    stagingProductivity: "Staging productivity", containerTotal: "Total totes",
    uniqueContainerTotal: "Unique tote count",
    stagerCount: "Staging employees", stagerCountCaption: "Employees with recorded totes",
    topProduction: "Top output", topStagerCount: "{count} totes",
    noStagingRecords: "No staging records", containersPerEmployee: "Totes per employee",
    containersPerEmployeeCaption: "Unique totes staged by each employee for the selected date.",
    searchEmployee: "Search employees", employee: "Employee", containerCount: "Totes",
    shareOfTotal: "Share of total", noStagingData: "No staging data for this date",
    stagingFooterCount: "{count} employees", totalContainers: "Total: {count} unique totes",
    dataSource: "Data source: Google Sheets", calculatedFromSheet: "Output is calculated from sheet records",
    downloadExcel: "Download Excel", refresh: "Refresh data",
    dayShift: "Light mode", nightShift: "Dark mode",
    loadError: "Could not load data: {details} Make sure the sheet is accessible to anyone with the link, then refresh.",
    exportError: "Could not download the Excel file: {details}",
    noDataLoaded: "Sheet data has not loaded yet.",
    noExcelLibrary: "The Excel export library is unavailable. Check your internet connection and try again.",
    sortingSheetName: "Sorting", stagingSheetName: "Staging", summarySheetName: "Summary",
    reportTitle: "Operations productivity report", department: "Department",
    employeeCount: "Employees", outputTotal: "Total output",
    highestSortingHour: "Most productive sorting hour", employeeName: "Employee name",
    username: "Username", totalQuantity: "Total (items)",
    uniqueContainers: "Unique totes", percentageTotal: "Share of total",
  },
};

function t(key, values = {}) {
  return (translations[state.language][key] || key).replace(/\{(\w+)\}/g, (_, name) => values[name] ?? "");
}

function applyLanguage() {
  document.documentElement.lang = state.language;
  document.documentElement.dir = state.language === "ar" ? "rtl" : "ltr";
  document.title = state.language === "ar" ? "مؤشر الإنتاجية | العمليات" : "Productivity Tracker | Operations";
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.placeholder = t(element.dataset.i18nPlaceholder);
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
    element.setAttribute("aria-label", t(element.dataset.i18nAria));
  });
  document.querySelector("#reportDate").setAttribute("aria-label", t("reportDate"));
  document.querySelector("#arabicButton").classList.toggle("is-selected", state.language === "ar");
  document.querySelector("#englishButton").classList.toggle("is-selected", state.language === "en");
  document.querySelector("#arabicButton").setAttribute("aria-pressed", String(state.language === "ar"));
  document.querySelector("#englishButton").setAttribute("aria-pressed", String(state.language === "en"));
  document.querySelector("#breadcrumbCurrent").textContent = t(state.activeView);
  const viewLabels = {
    overview: ["overviewTitle", "overviewSubtitle"],
    sorting: ["sortingTitle", "sortingSubtitle"],
    staging: ["stagingTitle", "stagingSubtitle"],
  };
  document.querySelector("#pageTitle").textContent = t(viewLabels[state.activeView][0]);
  document.querySelector("#pageSubtitle").textContent = t(viewLabels[state.activeView][1]);
  updateUpdatedLabel();
  renderTheme();
  renderActiveView();
}

function updateUpdatedLabel() {
  document.querySelector("#updatedAt").textContent = state.lastUpdated
    ? `${state.language === "ar" ? "آخر تحديث" : "Last updated"} ${new Intl.DateTimeFormat(state.language === "ar" ? "ar-EG" : "en-US", { hour: "2-digit", minute: "2-digit" }).format(state.lastUpdated)}`
    : (state.language === "ar" ? "في انتظار تحميل البيانات" : "Waiting for data");
  if (state.error) {
    document.querySelector("#errorNotice").textContent = t(state.error.key, state.error.values);
  }
}

function renderTheme() {
  const isDark = state.theme === "dark";
  document.documentElement.dataset.theme = state.theme;
  document.querySelector("#themeButton").setAttribute("aria-pressed", String(isDark));
  document.querySelector("#themeButton").setAttribute("aria-label", t(isDark ? "dayShift" : "nightShift"));
  document.querySelector("#themeLabel").textContent = t(isDark ? "dayShift" : "nightShift");
  document.querySelector("#themeIcon").textContent = isDark ? "☀" : "☾";
  document.querySelector('meta[name="theme-color"]').content = isDark ? "#171e1a" : "#f5f7f4";
}

function setLanguage(language) {
  state.language = language;
  savePreference("productivity-language", language);
  applyLanguage();
}

function toggleTheme() {
  state.theme = state.theme === "dark" ? "light" : "dark";
  savePreference("productivity-theme", state.theme);
  renderTheme();
}

function readPreference(key, fallback) {
  try {
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
}

function savePreference(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Preferences remain active for this page load if storage is unavailable.
  }
}

state.language = readPreference("productivity-language", "ar") === "en" ? "en" : "ar";
state.theme = readPreference("productivity-theme", "light") === "dark" ? "dark" : "light";

function localDateValue(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseSheetDate(value, formattedValue) {
  if (typeof formattedValue === "string" && formattedValue.trim()) {
    const match = formattedValue.trim().match(/^(\d{4})-(\d{1,2})-(\d{1,2})[ T](\d{1,2}):(\d{2})(?::(\d{2}))?/);
    if (match) {
      const [, year, month, day, hour, minute, second = "0"] = match;
      const date = new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second));
      if (!Number.isNaN(date.getTime())) return date;
    }
  }

  if (typeof value === "string") {
    const match = value.match(/^Date\((\d+),(\d+),(\d+),(\d+),(\d+),(\d+)\)$/);
    if (match) {
      const [, year, month, day, hour, minute, second] = match;
      return new Date(Number(year), Number(month), Number(day), Number(hour), Number(minute), Number(second));
    }
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  return null;
}

async function fetchSheet(sheetName, range, spreadsheetUrl = SHEET_URL) {
  const url = new URL(spreadsheetUrl);
  url.searchParams.set("tqx", "out:json");
  url.searchParams.set("sheet", sheetName);
  if (range) url.searchParams.set("range", range);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Google Sheets tab "${sheetName}" returned HTTP ${response.status}.`);

  const payload = await response.text();
  const jsonStart = payload.indexOf("{");
  const jsonEnd = payload.lastIndexOf("}");
  if (jsonStart < 0 || jsonEnd <= jsonStart) throw new Error(`Invalid response from Google Sheets tab "${sheetName}".`);

  const result = JSON.parse(payload.slice(jsonStart, jsonEnd + 1));
  if (result.status !== "ok" || !result.table) {
    throw new Error(result.errors?.[0]?.detailed_message || `Could not read Google Sheets tab "${sheetName}".`);
  }

  const labels = result.table.cols.map((column) => column.label);
  return result.table.rows.map((row) => Object.fromEntries(
    labels.map((label, index) => {
      const cell = row.c?.[index];
      return [label, cell?.v ?? null];
    }),
  ));
}

function getDateKey(date) {
  return date ? localDateValue(date) : "";
}

function selectedRows(rows, timestampField) {
  const selectedDate = dateInput.value;
  return rows.flatMap((row) => {
    const timestamp = parseSheetDate(row[timestampField], row[`${timestampField}__formatted`]);
    if (!timestamp || !isWithinSelectedWorkHours(timestamp, selectedDate)) return [];
    return [{ ...row, _timestamp: timestamp }];
  });
}

function isWithinSelectedWorkHours(timestamp, selectedDate) {
  const startHour = Number(workStartInput.value);
  const endHour = Number(workEndInput.value);
  const timestampDate = getDateKey(timestamp);

  if (startHour <= endHour) {
    return timestampDate === selectedDate
      && timestamp.getHours() >= startHour
      && timestamp.getHours() <= endHour;
  }

  const nextDate = new Date(`${selectedDate}T00:00:00`);
  nextDate.setDate(nextDate.getDate() + 1);
  const nextDateKey = localDateValue(nextDate);
  return (timestampDate === selectedDate && timestamp.getHours() >= startHour)
    || (timestampDate === nextDateKey && timestamp.getHours() <= endHour);
}

function currentSortingRows() {
  return selectedRows(state.sorting, "job_completed_at");
}

function currentStagingRows() {
  return selectedRows(state.staging, "staged_at");
}

function employeeUsername(identifier) {
  const value = String(identifier || "").trim();
  return value.includes("@") ? value.slice(0, value.indexOf("@")) : value;
}

function attendanceName(identifier) {
  const username = employeeUsername(identifier).toLowerCase();
  const matches = [...state.attendance.entries()]
    .filter(([id]) => id && username.startsWith(id))
    .sort((a, b) => b[0].length - a[0].length);
  return matches[0]?.[1] || employeeUsername(identifier);
}

function employeeMatches(identifier, query) {
  if (!query) return true;
  const normalizedQuery = query.toLowerCase();
  return employeeUsername(identifier).toLowerCase().includes(normalizedQuery)
    || attendanceName(identifier).toLowerCase().includes(normalizedQuery);
}

function getSortingReport() {
  const rows = currentSortingRows().filter((row) => row.sorter
    && (Number(row.sorted_qty) > 0 || Number(row.skipped_qty) > 0));
  const startHour = Number(workStartInput.value);
  const hours = [...new Set(rows
    .filter((row) => Number(row.sorted_qty) > 0)
    .map((row) => row._timestamp.getHours()))]
    .sort((a, b) => ((a - startHour + 24) % 24) - ((b - startHour + 24) % 24));
  const people = new Map();
  let skippedTotal = 0;

  for (const row of rows) {
    const sorter = String(row.sorter).trim();
    const hour = row._timestamp.getHours();
    const quantity = Number(row.sorted_qty) || 0;
    const skipped = Number(row.skipped_qty) || 0;
    if (!people.has(sorter)) people.set(sorter, { total: 0, skipped: 0, hours: new Map() });
    const person = people.get(sorter);
    person.total += quantity;
    person.skipped += skipped;
    skippedTotal += skipped;
    if (quantity > 0) person.hours.set(hour, (person.hours.get(hour) || 0) + quantity);
  }

  const sortedPeople = [...people.entries()].sort((a, b) => b[1].total - a[1].total);
  const total = sortedPeople.reduce((sum, [, person]) => sum + person.total, 0);
  const hourlyTotals = new Map(hours.map((hour) => [
    hour,
    sortedPeople.reduce((sum, [, person]) => sum + (person.hours.get(hour) || 0), 0),
  ]));
  const peak = [...hourlyTotals.entries()].sort((a, b) => b[1] - a[1])[0];
  return { hours, people: sortedPeople, total, skippedTotal, peak };
}

function renderSorting() {
  const { hours, people, total, skippedTotal, peak } = getSortingReport();
  document.querySelector("#sortingTotal").textContent = numberFormat.format(total);
  document.querySelector("#sorterCount").textContent = numberFormat.format(people.length);
  document.querySelector("#peakHour").textContent = peak ? formatHour(peak[0]) : "—";
  document.querySelector("#peakHourFoot").textContent = peak
    ? t("peakHourTotal", { count: numberFormat.format(peak[1]) })
    : t("noCompletedTasks");

  document.querySelector("#sortingHead").innerHTML = `
    <tr><th scope="col">${t("sortingHeader")}</th><th scope="col" class="rank-cell">${t("rank")}</th>
      ${hours.map((hour) => `<th scope="col">${formatHour(hour)}</th>`).join("")}
      <th scope="col">${t("skippedQty")}</th><th scope="col">${t("total")}</th></tr>`;

  const query = document.querySelector("#sorterSearch").value.trim();
  const visiblePeople = people.filter(([identifier]) => employeeMatches(identifier, query));
  document.querySelector("#sortingBody").innerHTML = visiblePeople.map(([identifier, person], index) => `
    <tr>
      <td>${personCell(identifier)}</td>
      <td class="rank-cell">${index + 1}</td>
      ${hours.map((hour) => {
        const quantity = person.hours.get(hour) || 0;
        return `<td class="${quantity ? "hour-has-value" : ""}">${quantity ? numberFormat.format(quantity) : "—"}</td>`;
      }).join("")}
      <td><span class="total-pill">${numberFormat.format(person.skipped)}</span></td>
      <td><span class="total-pill">${numberFormat.format(person.total)}</span></td>
    </tr>`).join("");

  const isEmpty = visiblePeople.length === 0;
  document.querySelector("#sortingEmpty").hidden = !isEmpty;
  document.querySelector(".sorting-table").hidden = isEmpty;
  document.querySelector("#sortingFooter").innerHTML = `<span>${t("sortingFooterCount", { count: visiblePeople.length })}</span><span>${t("totalPieces", { count: numberFormat.format(total) })}</span><span>${t("totalSkipped", { count: numberFormat.format(skippedTotal) })}</span>`;
}

function getStagingReport() {
  const rows = currentStagingRows().filter((row) => row.staged_by && row.container_barcode);
  const people = new Map();

  for (const row of rows) {
    const identifier = String(row.staged_by).trim();
    const barcode = String(row.container_barcode).trim();
    if (!barcode) continue;
    if (!people.has(identifier)) people.set(identifier, new Set());
    people.get(identifier).add(barcode);
  }

  const sortedPeople = [...people.entries()]
    .map(([identifier, barcodes]) => [identifier, barcodes.size])
    .sort((a, b) => b[1] - a[1]);
  const total = sortedPeople.reduce((sum, [, count]) => sum + count, 0);
  return { people: sortedPeople, total, top: sortedPeople[0] };
}

function renderStaging() {
  const { people, total, top } = getStagingReport();
  document.querySelector("#stagingTotal").textContent = numberFormat.format(total);
  document.querySelector("#stagerCount").textContent = numberFormat.format(people.length);
  document.querySelector("#topStager").textContent = top ? attendanceName(top[0]) : "—";
  document.querySelector("#topStagerFoot").textContent = top
    ? t("topStagerCount", { count: numberFormat.format(top[1]) })
    : t("noStagingRecords");

  const query = document.querySelector("#stagerSearch").value.trim();
  const visiblePeople = people.filter(([identifier]) => employeeMatches(identifier, query));
  document.querySelector("#stagingBody").innerHTML = visiblePeople.map(([identifier, count]) => `
    <tr>
      <td>${personCell(identifier)}</td>
      <td><span class="total-pill">${numberFormat.format(count)}</span></td>
      <td><div class="progress-cell"><span class="progress-value">${total ? Math.round(count / total * 100) : 0}%</span>
        <div class="progress-track" role="img" aria-label="${total ? Math.round(count / total * 100) : 0}%">
          <div class="progress-fill" style="width:${total ? count / total * 100 : 0}%"></div>
        </div></div></td>
    </tr>`).join("");

  const isEmpty = visiblePeople.length === 0;
  document.querySelector("#stagingEmpty").hidden = !isEmpty;
  document.querySelector(".staging-table").hidden = isEmpty;
  document.querySelector("#stagingFooter").innerHTML = `<span>${t("stagingFooterCount", { count: visiblePeople.length })}</span><span>${t("totalContainers", { count: numberFormat.format(total) })}</span>`;
}

function renderOverview() {
  const sorting = getSortingReport();
  const staging = getStagingReport();
  const employees = new Set([
    ...sorting.people.map(([identifier]) => employeeUsername(identifier).toLowerCase()),
    ...staging.people.map(([identifier]) => employeeUsername(identifier).toLowerCase()),
  ]);
  const hourlyTotals = sorting.hours.map((hour) => ({
    hour,
    total: sorting.people.reduce((sum, [, person]) => sum + (person.hours.get(hour) || 0), 0),
  }));
  const maxHourlyTotal = Math.max(0, ...hourlyTotals.map(({ total }) => total));

  document.querySelector("#overviewSortedTotal").textContent = numberFormat.format(sorting.total);
  document.querySelector("#overviewStagingTotal").textContent = numberFormat.format(staging.total);
  document.querySelector("#overviewEmployeeCount").textContent = numberFormat.format(employees.size);
  document.querySelector("#overviewPeakHour").textContent = sorting.peak ? formatHour(sorting.peak[0]) : "—";
  document.querySelector("#overviewPeakHourFoot").textContent = sorting.peak
    ? t("peakHourTotal", { count: numberFormat.format(sorting.peak[1]) })
    : t("noCompletedTasks");

  const chart = document.querySelector("#overviewHourlyChart");
  const chartEmpty = document.querySelector("#overviewChartEmpty");
  chart.setAttribute("aria-label", `${t("overviewHourlyTitle")}: ${t("sorting")}`);
  chart.hidden = hourlyTotals.length === 0;
  chartEmpty.hidden = hourlyTotals.length > 0;
  chart.innerHTML = hourlyTotals.map(({ hour, total }) => {
    const width = maxHourlyTotal ? total / maxHourlyTotal * 100 : 0;
    return `<div class="hourly-chart-row" title="${escapeHtml(formatHour(hour))}: ${escapeHtml(numberFormat.format(total))}">
      <span class="hourly-chart-hour">${formatHour(hour)}</span>
      <span class="hourly-chart-track"><span class="hourly-chart-bar" style="width:${width}%"></span></span>
      <strong class="hourly-chart-value">${numberFormat.format(total)}</strong>
    </div>`;
  }).join("");

  renderOverviewRanking(
    "#overviewSorterRanking",
    sorting.people.filter(([, person]) => person.total > 0)
      .map(([identifier, person]) => [identifier, person.total]).slice(0, 5),
    sorting.total,
    t("unitsPieces"),
    t("noSortingData"),
  );
  renderOverviewRanking(
    "#overviewStagerRanking",
    staging.people.slice(0, 5),
    staging.total,
    t("unitsContainers"),
    t("noStagingData"),
  );
}

function renderOverviewRanking(selector, people, total, unitLabel, emptyMessage) {
  const container = document.querySelector(selector);
  if (people.length === 0) {
    container.innerHTML = `<div class="overview-ranking-empty">${escapeHtml(emptyMessage)}</div>`;
    return;
  }

  const highest = people[0][1];
  container.innerHTML = people.map(([identifier, amount], index) => {
    const percent = highest ? amount / highest * 100 : 0;
    const share = total ? Math.round(amount / total * 100) : 0;
    return `<div class="overview-ranking-row">
      <span class="overview-rank">${index + 1}</span>
      <span class="overview-rank-details">${personCell(identifier)}
        <span class="overview-rank-track" aria-hidden="true"><span style="width:${percent}%"></span></span>
      </span>
      <strong class="overview-rank-total">${numberFormat.format(amount)}<small>${escapeHtml(unitLabel)}</small></strong>
      <span class="overview-rank-share">${share}%</span>
    </div>`;
  }).join("");
}

function exportWorkbook() {
  if (!state.loaded) throw new Error(t("noDataLoaded"));
  if (!window.XLSX) throw new Error(t("noExcelLibrary"));

  const sorting = getSortingReport();
  const staging = getStagingReport();
  const workbook = window.XLSX.utils.book_new();
  const summaryRows = [
    [t("reportTitle")],
    [t("reportDate"), dateInput.value],
    [t("workHours"), `${formatHour(Number(workStartInput.value))} – ${formatHour(Number(workEndInput.value))}`],
    [],
    [t("department"), t("employeeCount"), t("outputTotal")],
    [t("sorting"), sorting.people.length, sorting.total],
    [t("staging"), staging.people.length, staging.total],
    [t("highestSortingHour"), sorting.peak ? formatHour(sorting.peak[0]) : "—", sorting.peak?.[1] || 0],
    [t("totalSkipped"), sorting.skippedTotal],
  ];
  const sortingRows = [
    [t("rank"), t("employeeName"), t("username"), ...sorting.hours.map(formatHour), t("totalQuantity"), t("skippedQty")],
    ...sorting.people.map(([identifier, person], index) => [
      index + 1,
      attendanceName(identifier),
      employeeUsername(identifier),
      ...sorting.hours.map((hour) => person.hours.get(hour) || 0),
      person.total,
      person.skipped,
    ]),
  ];
  const stagingRows = [
    [t("rank"), t("employeeName"), t("username"), t("uniqueContainers"), t("percentageTotal")],
    ...staging.people.map(([identifier, count], index) => [
      index + 1,
      attendanceName(identifier),
      employeeUsername(identifier),
      count,
      staging.total ? count / staging.total : 0,
    ]),
  ];

  const summarySheet = window.XLSX.utils.aoa_to_sheet(summaryRows);
  const sortingSheet = window.XLSX.utils.aoa_to_sheet(sortingRows);
  const stagingSheet = window.XLSX.utils.aoa_to_sheet(stagingRows);
  if (stagingRows.length > 1) {
    for (let row = 1; row < stagingRows.length; row += 1) {
      const percentageCell = window.XLSX.utils.encode_cell({ r: row, c: 4 });
      stagingSheet[percentageCell].z = "0%";
    }
  }
  summarySheet["!cols"] = [{ wch: 24 }, { wch: 27 }, { wch: 20 }];
  sortingSheet["!cols"] = [{ wch: 6 }, { wch: 36 }, { wch: 22 }, ...sorting.hours.map(() => ({ wch: 13 })), { wch: 18 }, { wch: 18 }];
  stagingSheet["!cols"] = [{ wch: 6 }, { wch: 36 }, { wch: 22 }, { wch: 22 }, { wch: 22 }];
  window.XLSX.utils.book_append_sheet(workbook, summarySheet, t("summarySheetName"));
  window.XLSX.utils.book_append_sheet(workbook, sortingSheet, t("sortingSheetName"));
  window.XLSX.utils.book_append_sheet(workbook, stagingSheet, t("stagingSheetName"));
  window.XLSX.writeFile(workbook, `employee-productivity-${dateInput.value}.xlsx`);
}

function formatHour(hour) {
  return `${String(hour).padStart(2, "0")}:00`;
}

function populateWorkHourOptions() {
  for (const input of [workStartInput, workEndInput]) {
    for (let hour = 0; hour < 24; hour += 1) {
      const value = String(hour).padStart(2, "0");
      const option = document.createElement("option");
      option.value = value;
      option.textContent = formatHour(hour);
      option.selected = value === input.dataset.default;
      input.append(option);
    }
  }
}

function personCell(identifier) {
  const username = employeeUsername(identifier);
  const safeIdentifier = escapeHtml(username);
  const name = attendanceName(identifier);
  const initial = [...name][0] || "؟";
  return `<div class="person-cell"><span class="person-avatar" aria-hidden="true">${escapeHtml(initial)}</span>
    <span class="person-details"><span class="person-name">${escapeHtml(name)}</span>
      <span class="person-email">${safeIdentifier}</span></span></div>`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
}

function renderActiveView() {
  if (state.activeView === "overview") renderOverview();
  else if (state.activeView === "sorting") renderSorting();
  else renderStaging();
}

function showError(key, values) {
  state.error = { key, values };
  const notice = document.querySelector("#errorNotice");
  notice.textContent = t(key, values);
  notice.hidden = false;
}

async function loadData() {
  const loading = document.querySelector("#loadingNotice");
  const error = document.querySelector("#errorNotice");
  const refresh = document.querySelector("#refreshButton");
  const exportButton = document.querySelector("#exportButton");
  loading.hidden = false;
  error.hidden = true;
  refresh.disabled = true;
  exportButton.disabled = true;

  try {
    const [sorting, staging, attendance] = await Promise.all([
      fetchSheet("Sorting"),
      fetchSheet("staging"),
      fetchSheet("CAIID01", "A2:K1000", ATTENDANCE_URL),
    ]);
    state.attendance = new Map(attendance
      .filter((row) => row.ID && row["Employee Name"] && row["Employee Name"] !== "#N/A")
      .map((row) => [String(row.ID).trim().toLowerCase(), String(row["Employee Name"]).trim()]));
    state.sorting = sorting.map((row) => ({
      ...row,
      job_completed_at__formatted: row.job_completed_at,
    }));
    state.staging = staging.map((row) => ({
      ...row,
      staged_at__formatted: row.staged_at,
    }));
    state.loaded = true;
    state.lastUpdated = new Date();
    state.error = null;
    renderActiveView();
    updateUpdatedLabel();
  } catch (error) {
    showError("loadError", { details: error.message });
  } finally {
    loading.hidden = true;
    refresh.disabled = false;
    exportButton.disabled = !state.loaded;
  }
}

function setActiveView(view) {
  state.activeView = view;
  for (const currentView of ["overview", "sorting", "staging"]) {
    const section = document.querySelector(`#${currentView}View`);
    const isActive = currentView === view;
    section.hidden = !isActive;
    section.classList.toggle("is-visible", isActive);
  }
  const viewLabels = {
    overview: ["overviewTitle", "overviewSubtitle"],
    sorting: ["sortingTitle", "sortingSubtitle"],
    staging: ["stagingTitle", "stagingSubtitle"],
  };
  document.querySelector("#pageTitle").textContent = t(viewLabels[view][0]);
  document.querySelector("#pageSubtitle").textContent = t(viewLabels[view][1]);
  document.querySelector("#breadcrumbCurrent").textContent = t(view);
  document.querySelectorAll(".nav-item").forEach((button) => {
    const active = button.dataset.view === view;
    button.classList.toggle("is-active", active);
    if (active) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
  renderActiveView();
}

dateInput.value = localDateValue();
populateWorkHourOptions();
document.querySelectorAll(".nav-item").forEach((button) => {
  button.addEventListener("click", () => setActiveView(button.dataset.view));
});
document.querySelectorAll("[data-go-view]").forEach((button) => {
  button.addEventListener("click", () => setActiveView(button.dataset.goView));
});
dateInput.addEventListener("change", renderActiveView);
workStartInput.addEventListener("change", renderActiveView);
workEndInput.addEventListener("change", renderActiveView);
document.querySelector("#sorterSearch").addEventListener("input", renderSorting);
document.querySelector("#stagerSearch").addEventListener("input", renderStaging);
document.querySelector("#refreshButton").addEventListener("click", loadData);
document.querySelector("#exportButton").addEventListener("click", () => {
  try {
    exportWorkbook();
  } catch (error) {
    showError("exportError", { details: error.message });
  }
});
document.querySelector("#arabicButton").addEventListener("click", () => setLanguage("ar"));
document.querySelector("#englishButton").addEventListener("click", () => setLanguage("en"));
document.querySelector("#themeButton").addEventListener("click", toggleTheme);
applyLanguage();
loadData();
