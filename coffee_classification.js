export class TasteClassification {
  constructor(coffees) {
    this.coffees = coffees;
    this.mediumValue = 5;
  }

  isAcidicTaste() {
    const acidicTaste = this.coffees.filter(
      (coffee) => coffee.bitternessLevel < this.mediumValue,
    );
    return acidicTaste;
  }

  isBitterTaste() {
    const bitterTaste = this.coffees.filter(
      (coffee) => coffee.bitternessLevel > this.mediumValue,
    );
    return bitterTaste;
  }

  isWellBalancedTaste() {
    const wellBalancedTaste = this.coffees.filter(
      (coffee) => coffee.bitternessLevel === this.mediumValue,
    );
    return wellBalancedTaste;
  }
}

export class BodyClassification {
  constructor(coffees, mediumValue) {
    this.coffees = coffees;
    this.mediumValue = mediumValue;
  }

  isLightBody() {
    const lightBody = this.coffees.filter(
      (coffee) => coffee.richnessLevel < this.mediumValue,
    );
    return lightBody;
  }

  isFullBody() {
    const fullBody = this.coffees.filter(
      (coffee) => coffee.richnessLevel > this.mediumValue,
    );
    return fullBody;
  }

  isMediumBody() {
    const mediumBody = this.coffees.filter(
      (coffee) => coffee.richnessLevel === this.mediumValue,
    );
    return mediumBody;
  }
}
