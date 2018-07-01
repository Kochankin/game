'use strict';

(function () {

  const monster = document.getElementById("monster");
  const ctx = monster.getContext('2d');

// MONSTER NAME generating
 const monsterNames = {
  type: ["ужасный", "злобный", "сопливый", "страшный", "опасный", "могучий", "неуловимый", "великий", "стойкий", "бессмертный", "всесильный", "вонючий", "волосатый", "неугомонный", "унылый", "кошмарный", "грязный", "слюнявый"],
  kind: ["Огр", "Гном", "Гоблин", "Эльф", "Зомби", "Соплохвост", "Глиноклок", "Громамонт", "Грюмошмель", "Йети", "Квинтолап", "Клешнепод", "Тролль", "Великан", "Вампир", "Штырехвост", "Упырь", "Раздражар", "Пеплозмей", "Наргл", "Лепрекон"],
  name: ["Том", "Макс", "Джек", "Пит", "Джон", "Питер", "Алекс", "Бен", "Карл", "Фил", "Фрэнк", "Гарри", "Майкл", "Оскар", "Сэм", "Роб", "Тед", "Уилл", "Тим", "Патрик"]
};

function getMonsterName(array) {
  return _.sample(array.type) + ' ' + _.sample(array.kind) + ' ' + _.sample(array.name);
}

// MONSTER APPEARANCE generating
const monsterParts = {
  head: {src: 'img/head.png', partsNum: 13, sx: 0, sy: 0, swidth: 301, sheight: 250, x: 80, y: 0, width: 110, height: 100},
  body: {src: 'img/body.png', partsNum: 7, sx: 0, sy: 0, swidth: 400, sheight: 400, x: 55, y: 75, width: 160, height: 160},
  lArm: {src: 'img/armLeft.png', partsNum: 5, sx: 0, sy: 0, swidth: 235, sheight: 120, x: 5, y: 110, width: 94, height: 48},
  rArm: {src: 'img/armRight.png', partsNum: 5, sx: 0, sy: 0, swidth: 235, sheight: 120, x: 170, y: 110, width: 94, height: 48},
  weapon: {src: 'img/weapon.png', partsNum: 7, sx: 0, sy: 0, swidth: 200, sheight: 408, x: 220, y: 0, width: 80, height: 170},
  lLeg: {src: 'img/legLeft.png', partsNum: 5, sx: 0, sy: 0, swidth: 180, sheight: 245, x: 65, y: 205, width: 70, height: 100},
  rLeg: {src: 'img/legRight.png', partsNum: 5, sx: 0, sy: 0, swidth: 180, sheight: 245, x: 135, y: 205, width: 70, height: 100}
};

function generatePartsArr (partsNum, value){
    const arr = [];
    for (let i = 0; i < partsNum; i++ ){arr.push(i * value); }
    return arr;
  }

  function generateBodyPart(part){
    const partImage = new Image(); 
    partImage.src = part.src; 
    return partImage;
  }

  function loadLArm(lArm, lArmImage, thisArm) {
    return function() { 
      ctx.drawImage(lArmImage,  lArm.sx, thisArm,  lArm.swidth, lArm.sheight, lArm.x, lArm.y, lArm.width, lArm.height);
    }
  }

  function loadRArm(rArm, rArmImage, thisArm) {
    return function() { 
      ctx.drawImage(rArmImage,  rArm.sx, thisArm,  rArm.swidth, rArm.sheight, rArm.x, rArm.y, rArm.width, rArm.height);
    }
  }

  function loadLLeg(lLeg, lLegImage, thisLeg) {
    return function() {   
      ctx.drawImage(lLegImage, thisLeg, lLeg.sy, lLeg.swidth, lLeg.sheight, lLeg.x, lLeg.y, lLeg.width, lLeg.height);  
    }
  }

  function loadRLeg(rLeg, rLegImage, thisLeg) {
    return function() {   
      ctx.drawImage(rLegImage, thisLeg, rLeg.sy, rLeg.swidth, rLeg.sheight, rLeg.x, rLeg.y, rLeg.width, rLeg.height);  
    }
  }

  function loadWeapon(weapon, weaponImage) {
    return function() {   
      ctx.drawImage(weaponImage,  _.sample(generatePartsArr(weapon.partsNum, weapon.swidth)), weapon.sy,weapon.swidth,weapon.sheight,weapon.x,weapon.y,weapon.width,weapon.height);
    }
  }

  function loadBody(body, bodyImage) {
    return function() {   
      ctx.drawImage(bodyImage, _.sample(generatePartsArr(body.partsNum, body.swidth)), body.sy, body.swidth, body.sheight, body.x, body.y, body.width, body.height);
    }
  }

  function loadHead(head, headImage, thisHead) {
    return headImage.onload = function() {  
      ctx.drawImage(headImage, thisHead, head.sy,head.swidth,head.sheight,head.x,head.y,head.width,head.height);
    }
  }
  
  function generateMonster(){
    const lArm = monsterParts.lArm;
    const lArmImage = generateBodyPart(lArm);
    const thisArm = _.sample(generatePartsArr(lArm.partsNum, lArm.sheight));
    const rArm = monsterParts.rArm;
    const rArmImage = generateBodyPart(rArm);

    const lLeg = monsterParts.lLeg;
    const lLegImage = generateBodyPart(lLeg);
    const thisLeg = _.sample(generatePartsArr(lLeg.partsNum, lLeg.swidth));
    const rLeg = monsterParts.rLeg;
    const rLegImage = generateBodyPart(rLeg);

    const weapon = monsterParts.weapon;
    const weaponImage = generateBodyPart(weapon);

    const body = monsterParts.body;
    const bodyImage = generateBodyPart(body);

    const head = monsterParts.head;
    const thisHead = _.sample(generatePartsArr(head.partsNum, head.swidth));
    const headImage = generateBodyPart(head);

    Promise.all([
      new Promise((resolve) => {    
        lArmImage.onload = loadLArm(lArm, lArmImage, thisArm);
        resolve(); 
      }), // lArm
      new Promise((resolve) => {      
        rArmImage.onload = loadRArm(rArm, rArmImage, thisArm);
          resolve();
      }), // rArm
      new Promise((resolve) => { 
        lLegImage.onload = loadLLeg(lLeg, lLegImage, thisLeg);  
        resolve();
      }),  // lLeg
      new Promise((resolve) => {    
        rLegImage.onload = loadRLeg(rLeg, rLegImage, thisLeg);
        resolve();
      }),  // rLeg  
      new Promise((resolve) => {    
        weaponImage.onload = loadWeapon(weapon, weaponImage); 
        resolve();
      })  // weapon
    ])
    .then(() => {bodyImage.onload = loadBody(body, bodyImage);}) // body
    .then(() => { loadHead(head, headImage, thisHead); });// head
  }

window.monsters = {
    monsterNames : monsterNames,
    getMonsterName : getMonsterName,
    generateMonster : generateMonster
  };

})();
