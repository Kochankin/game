'use strict';

(function () {

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
    for (let i = 0; i < partsNum; i++ ){arr.push(i*value); }
    return arr;
  }
  
  function generateMonster(){
    const lArmImage = new Image(); 
    const rArmImage = new Image(); 
    const lLegImage = new Image(); 
    const rLegImage = new Image(); 
    const bodyImage = new Image(); 
    const headImage = new Image(); 
    const weaponImage = new Image(); 
  
    const monster = document.getElementById("monster");
    const ctx = monster.getContext('2d');

    ctx.globalCompositeOperation="source-over"; 

    setTimeout(() => {
      const body = monsterParts.body;
      bodyImage.src = body.src;  
      const bodyParts = generatePartsArr(body.partsNum, body.swidth);
      bodyImage.onload = function() {   
        ctx.drawImage(bodyImage, _.sample(bodyParts), body.sy, body.swidth, body.sheight, body.x, body.y, body.width, body.height);
      }

      setTimeout(() => {
        const head = monsterParts.head;
        const headParts = generatePartsArr(head.partsNum, head.swidth);
        const thisHead = _.sample(headParts);
        headImage.src = head.src;  
        headImage.onload = function() {  
          ctx.drawImage(headImage, thisHead, head.sy,head.swidth,head.sheight,head.x,head.y,head.width,head.height);
        }
      }, 200);

    }, 150);

    const lArm = monsterParts.lArm;
    const armParts = generatePartsArr(lArm.partsNum, lArm.sheight);
    const thisArm = _.sample(armParts);
    lArmImage.src = lArm.src;  
    lArmImage.onload = function() { 
      ctx.drawImage(lArmImage,  lArm.sx, thisArm,  lArm.swidth, lArm.sheight, lArm.x, lArm.y, lArm.width, lArm.height);
    }
    
    const rArm = monsterParts.rArm;
    rArmImage.src = rArm.src;  
    rArmImage.onload = function() { 
      ctx.drawImage(rArmImage,  rArm.sx, thisArm,  rArm.swidth, rArm.sheight, rArm.x, rArm.y, rArm.width, rArm.height);
    }
  
    const lLeg = monsterParts.lLeg;
    lLegImage.src = lLeg.src; 
    const legParts = generatePartsArr(lLeg.partsNum, lLeg.swidth); 
    const thisLeg = _.sample(legParts);
    lLegImage.onload = function() {   
      ctx.drawImage(lLegImage, thisLeg, lLeg.sy, lLeg.swidth, lLeg.sheight, lLeg.x, lLeg.y, lLeg.width, lLeg.height);   
    }
  
    const rLeg = monsterParts.rLeg;
    rLegImage.src = rLeg.src;  
    rLegImage.onload = function() {   
      ctx.drawImage(rLegImage, thisLeg, rLeg.sy, rLeg.swidth, rLeg.sheight, rLeg.x, rLeg.y, rLeg.width, rLeg.height); 
    }
    
    const weapon = monsterParts.weapon;
    weaponImage.src = weapon.src; 
    const weaponParts = generatePartsArr(weapon.partsNum, weapon.swidth); 
    weaponImage.onload = function() {   
      ctx.drawImage(weaponImage,  _.sample(weaponParts), weapon.sy,weapon.swidth,weapon.sheight,weapon.x,weapon.y,weapon.width,weapon.height); 
    }

    
  }

window.monsters = {
    monsterNames : monsterNames,
    getMonsterName : getMonsterName,
    generateMonster : generateMonster
  };

})();
