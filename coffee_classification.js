export class TasteClassification {
  constructor(coffees) {
    this.coffees = coffees;
  }

  isAcidicTaste() {
    const acidicTaste = this.coffees.filter(
      (coffee) => coffee.bitternessLevel <= 4
    );
    return acidicTaste;
  }

  isBitterTaste() {
    const bitterTaste = this.coffees.filter(
      (coffee) => coffee.bitternessLevel >= 6
    );
    return bitterTaste;
  }

  isWellBalancedTaste() {
    const wellBalancedTaste = this.coffees.filter(
      (coffee) => coffee.bitternessLevel === 5
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
      (coffee) => coffee.richnessLevel < this.mediumValue
    );
    return lightBody;
  }

  isFullBody() {
    const fullBody = this.coffees.filter(
      (coffee) => coffee.richnessLevel > this.mediumValue
    );
    return fullBody;
  }

  isMediumBody() {
    const mediumBody = this.coffees.filter(
      (coffee) => coffee.richnessLevel === this.mediumValue
    );
    return mediumBody;
  }
}
