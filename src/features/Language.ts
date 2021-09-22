export const getLanguage = (value: string): string => {
  const languages: { [key: string]: string } = {
    go: "Go",
    js: "JavaScript",
    cpp: "C++",
    sql: "SQL",
    py: "Python",
    css: "CSS",
    html: "HTML",
    java: "Java",
    cs: "C#",
    bash: "Bash",
    vba: "VBA"
  };

  return languages[value];
};
