export class TasteClassification {
  constructor(coffees, median) {
    this.coffees = coffees;
    this.median = median;
  }

  suggestByTaste(preference) {
    if (preference === "acidicTaste") {
      return this.#acidicTasteCoffees();
    } else if (preference === "bitterTaste") {
      return this.#bitterTasteCoffees();
    } else {
      return this.#wellBalancedTasteCoffees();
    }
  }

  #acidicTasteCoffees() {
    const acidicTaste = this.coffees.filter(
      (coffee) => coffee.bitternessLevel < this.median,
    );
    return acidicTaste;
  }

  #bitterTasteCoffees() {
    const bitterTaste = this.coffees.filter(
      (coffee) => coffee.bitternessLevel > this.median,
    );
    return bitterTaste;
  }

  #wellBalancedTasteCoffees() {
    const wellBalancedTaste = this.coffees.filter(
      (coffee) => coffee.bitternessLevel === this.median,
    );
    return wellBalancedTaste;
  }
}

export class BodyClassification {
  constructor(coffees, median) {
    this.coffees = coffees;
    this.median = median;
  }

  suggestByBody(preference) {
    if (preference === "lightBody") {
      return this.#lightBodyCoffees();
    } else if (preference === "fullBody") {
      return this.#fullBodyCoffees();
    } else {
      return this.#mediumBodyCoffees();
    }
  }

  #lightBodyCoffees() {
    const lightBody = this.coffees.filter(
      (coffee) => coffee.richnessLevel < this.median,
    );
    return lightBody;
  }

  #fullBodyCoffees() {
    const fullBody = this.coffees.filter(
      (coffee) => coffee.richnessLevel > this.median,
    );
    return fullBody;
  }

  #mediumBodyCoffees() {
    const mediumBody = this.coffees.filter(
      (coffee) => coffee.richnessLevel === this.median,
    );
    return mediumBody;
  }
}
