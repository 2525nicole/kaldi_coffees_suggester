export class TasteClassification {
  constructor(coffees) {
    this.coffees = coffees;
    this.median = 5;
  }

  acidicTasteCoffees() {
    const acidicTaste = this.coffees.filter(
      (coffee) => coffee.bitternessLevel < this.median,
    );
    return acidicTaste;
  }

  bitterTasteCoffees() {
    const bitterTaste = this.coffees.filter(
      (coffee) => coffee.bitternessLevel > this.median,
    );
    return bitterTaste;
  }

  wellBalancedTasteCoffees() {
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

  lightBodyCoffees() {
    const lightBody = this.coffees.filter(
      (coffee) => coffee.richnessLevel < this.median,
    );
    return lightBody;
  }

  fullBodyCoffees() {
    const fullBody = this.coffees.filter(
      (coffee) => coffee.richnessLevel > this.median,
    );
    return fullBody;
  }

  mediumBodyCoffees() {
    const mediumBody = this.coffees.filter(
      (coffee) => coffee.richnessLevel === this.median,
    );
    return mediumBody;
  }
}
