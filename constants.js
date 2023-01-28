exports.calories = [
    { value: 1, price: 65000, label: "1100 kcal" },
    { value: 2, price: 70000, label: "1500 kcal" },
    { value: 3, price: 75000, label: "2000 kcal" },
    { value: 4, price: 80000, label: "2500 kcal" },
    { value: 5, price: 85000, label: "3000 kcal" },
  ];
  exports.mealPlansSession = [
    { value: 1, ratio: 0, quantity: 2, label: "Sáng - Trưa" },
    { value: 2, ratio: 0, quantity: 2, label: "Trưa - Tối" },
    { value: 3, ratio: 0, quantity: 2, label: "Sáng - Tối" },
    { value: 4, ratio: 2, quantity: 3, label: "Sáng - Trưa - Tối" },
  ];
  exports.mealPlans = [
    { value: 1, ratio: 0, quantity: 6, label: "1 tuần" },
    { value: 2, ratio: 2, quantity: 12, label: "2 tuần" },
  ];

  exports.uri = 'mongodb://127.0.0.1:27017/?replicaSet=rs0&w=majority&readPreference=primary&ssl=false';
   