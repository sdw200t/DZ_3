class Good { // класс для хранения данных о товаре со свойствами
    constructor(id, name, description, sizes, price, available) { // конструктор экземпляра товара принимающий параметры соответствующие свойствам выше
        this.id = id;                   // Код товара
        this.name = name;               // Наименование
        this.description = description; // Описание
        this.sizes = sizes;             // массив возможных размеров
        this.price = price;             // цена товара
        this.available = available;     // Признак доступности для продажи
    }
    setAvailable(available) { // изменение признака доступности для продажи
        this.available = available;
    }
}

class GoodList { // класс для хранения каталога товаров со свойствами
    #goods = new Array();        // массив экземпляров объектов класса Good (приватное поле)
    constructor() {
        this.filter = undefined;    // регулярное выражение используемое для фильтрации товаров по полю name
        this.sortPrice = false;     // булево значение, признак включения сортировки по полю Price
        this.sortDir = true;       // булево значение, признак направления сортировки по полю Price (true - по возрастанию, false - по убыванию)
    }
    get list() {   // возвращает массив доступных для продажи товаров в соответствии с установленным фильтром и сортировкой по полю Price
        var regexp = new RegExp(this.filter,'i')
        var rez = this.#goods.filter(good => good.available == true && regexp.test(good.name))
        if (this.sortPrice == true) {
            rez.sort((p1, p2) => this.sortDir ? (p1.price - p2.price) : p1.price)
        }
        return rez
    }
    add(good) {        // добавление товара в каталог
        this.#goods.push(good);
    }
    remove(id) {   // удаление товара из каталога по его id
        this.#goods.forEach((element, index) => {
            if (element.id == id) {
                this.#goods.splice(index, 1);
            }    
        });
    }
}

class BasketGood extends Good { // класс дочерний от Good, для хранения данных о товаре в корзине с дополнительным свойством
    constructor(good, amount) {
        super(good.id, good.name, good.description, good.sizes, good.price, good.available);
        this.amount = amount; // количество товара в корзине
    }
}

class Basket { // класс для хранения данных о корзине товаров со свойствами
    constructor() {
        this.goods = new Array() // массив объектов класса BasketGood для хранения данных о товарах в корзине
    }
    get totalAmount() {  // возвращает общее количество товаров в корзине
        var amount = 0
        this.goods.forEach((element) => {
                amount += element.amount
            }    
        );    
        return amount
    }
    get totalSum() {    // возвращает общую стоимость товаров в корзине 
        var sum = 0
        this.goods.forEach((element) => {
                sum += element.price * element.amount
            }    
        );    
        return sum
    }
    add(good, amount) {  // Добавляет товар в корзину, если товар уже есть увеличивает количество
        var basketGood = this.goods.find(el => el.id == good.id)
        if (basketGood == undefined) {
            basketGood = new BasketGood(good, amount)
            this.goods.push(basketGood)
        } else {
            basketGood.amount += amount
        }
    }
    remove(good, amount) {  // Уменьшает количество товара в корзине, если количество становится равным нулю, товар удаляется
        var basketGood = this.goods.find(el => el.id == good.id)
        if (basketGood == undefined) {
        } else {
            basketGood.amount -= amount
            if (basketGood.amount <= 0) {
                this.goods.forEach((element, index) => {
                    if (element.id == basketGood.id) {
                        this.goods.splice(index, 1);
                    }    
                })                
            }
        }
    }
    clear() {               // Очищает содержимое корзины
        this.goods = new Array()
    }
    removeUnavailable() {   // Удаляет из корзины товары, имеющие признак available === false (использовать filter())
        var delGoods = this.goods.filter(good => good.available === false);
        delGoods.forEach(delEl => {
            this.goods.forEach((element, index) => {
                if (element.id == delEl.id) {
                    this.goods.splice(index, 1);
                }  
            })
        })
    }
}

var good1 = new Good(11231, 'Tomato', 'Tomato', new Array, 13, true)
var good2 = new Good(23232, 'Potato', 'Potato', new Array, 10, true)
var good3 = new Good(34533, 'Cucumber', 'Cucumber', new Array, 1, true)
var good4 = new Good(45632, 'Onion', 'Onion', new Array, 3, true)
var good5 = new Good(56432, 'Eggplant', 'Eggplant', new Array, 6, true)

var goodList = new GoodList();
goodList.add(good1);
goodList.add(good2);
goodList.add(good3);
goodList.add(good4);
goodList.add(good5);

//goodList.remove(56432)
//good5.setAvailable(false)
//console.log(goodList.list)

var basket = new Basket()
basket.add(good5, 3)
basket.add(good5, 3)

basket.remove(good1, 6)
//basket.remove(good5, 6)
basket.remove(good5, 4)
console.log(basket.totalAmount)
console.log(basket.totalSum)
//basket.clear()
//console.log(basket)

goodList.filter = "o"
goodList.sortPrice = true
//goodList.sortDir = false
console.log(goodList.list)

