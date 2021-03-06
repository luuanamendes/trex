//variaveis
var trex, trexCorrendo, trexParado;

var solo, imgSolo, soloInvisivel;

var imgNuvem;

var imgCacto1, imgCacto2, imgCacto3, imgCacto4, imgCacto5, imgCacto6;

var gameOver, imgGameOver, btnReiniciar, imgBtnReiniciar;

var somPular, somBateu;

var cactos, nuvens;

var p1, p2;

var pontuacao = 0;

var vidas = 0;

var maiorPont = 0;

var JOGANDO = 1;
var PARADO = 0;
var estadoJogo = JOGANDO;

//atribui as imagens para dentro das variaveis
function preload(){
  trexCorrendo =   loadAnimation("trex1.png","trex2.png","trex3.png");
  
  trexParado = loadImage("trex_parado.png");
  
  imgSolo = loadImage("solo.png");
  
  imgNuvem = loadImage("nuvem.png");
  
  imgCacto1 = loadImage("cacto1.png");
  imgCacto2 = loadImage("cacto2.png");
  imgCacto3 = loadImage("cacto3.png");
  imgCacto4 = loadImage("cacto4.png");
  imgCacto5 = loadImage("cacto5.png");
  imgCacto6 = loadImage("cacto6.png");
  
  imgGameOver = loadImage("gameOver.png");
  imgReiniciar = loadImage("reiniciar.png");
  
  somPular = loadSound("pular.mp3");
  somBateu = loadSound("bateu.mp3");
}

function setup() {
  createCanvas(500, 400);
  
  //cria o trex
  trex = createSprite(50,350,30,30);
  trex.addAnimation("running", trexCorrendo);
  trex.addImage("collided", trexParado);
  trex.scale = 0.5;
  trex.setCollider("circle",0,0,40);
  //trex.debug = true;
  
  //cria o solo
  solo = createSprite(250,360,500,20);
  solo.addImage("ground",imgSolo);
  
  //cria o game over
  gameOver = createSprite(250,200);
  gameOver.addImage(imgGameOver);
  gameOver.scale = 0.5;
  gameOver.visible = false;
  
  //cria o reiniciar
  reiniciar = createSprite(250,240);
  reiniciar.addImage(imgReiniciar);
  reiniciar.scale = 0.5;
  reiniciar.visible = false;

  //cria o solo invisivel
  soloInvisivel = createSprite(250,380,500,20);
  soloInvisivel.visible = false;
  
  p1 = createSprite(165,35,1,15);
  p1 = createSprite(285,35,1,15);
  
  //cria um grupo de nuvens
  nuvens = new Group();
  
  //cria um grupo de cactos
  cactos = new Group();
}

function draw() {
  //define a cor do fundo
  background(250);
  
  //exibe as vidas
  text("Vidas: "+ vidas, 95,40);
  
  //exibe a pontua????o
  text("Pontua????o: "+ pontuacao, 180,40);
  
  //exibe a maior pontua????o
  text("Maior Pontua????o: "+ maiorPont,295,40);
  
  
  //se o estado do jogo estiver em JOGANDO, ent??o...
  if (estadoJogo === JOGANDO){
    
    //pontua????o come??a a contar
    pontuacao = pontuacao + Math.round(getFrameRate()/50);
    
    //movimenta o solo
    solo.velocityX = -5;
  
    //se o ESPA??O for pressionado o trex pula
    if(keyDown("space") && trex.y >= 320) {
      trex.velocityY = -12;
      somPular.play();
    }
  
    //adiciona gravidade ao trex
    trex.velocityY = trex.velocityY + 0.8
  
    //o solo se repete infinitamente
    if (solo.x < 0){
      solo.x = solo.width/2;
    }
    
    //trex colide com a sprite do solo invisivel 
    trex.collide(soloInvisivel);
    
    //chama a fun????o gerar nuvens
    gerarNuvens();
    
    //chama a fun????o gerar cactos
    criarCactos();
    
    //se o trex bater no grupo de cactos
    if(cactos.isTouching(trex)){
        //altera o estado do jogo
        estadoJogo = PARADO;
        somBateu.play();
        //muda a maior pontua????o
        if(maiorPont < pontuacao){
          maiorPont = pontuacao;
        }
    }
  }
  
  //se o estado do jogo estiver em PARADO, ent??o...
  else if (estadoJogo === PARADO) {
    
    //muda a visibilidade das imagens de gameOver/reiniciar
    gameOver.visible = true;
    reiniciar.visible = true;
    
    //define velocidade das sprites do jogo como 0
    solo.velocityX = 0;
    trex.velocityY = 0;
    
    //define velocidade dos grupos do jogo como 0
    cactos.setVelocityXEach(0);
    nuvens.setVelocityXEach(0);
    
    //altera a anima????o do Trex
    trex.changeAnimation("collided",trexParado);
    
    //define o tempo de vida dos objetos do jogo para que nunca sejam destru??dos
    cactos.setLifetimeEach(-1);
    nuvens.setLifetimeEach(-1);
    
    //quando o mouse clica na sprite reiniciar
    if(mousePressedOver(reiniciar)) {
      //chama a fun????o reset
      reset();
    }
    
  }
  
  //desenha as sprites
  drawSprites();
}

//cria a fun????o de gerar nuvens
function gerarNuvens() {
  //se o resto da divis??o do frameCount por 60 for 0, entao...
  if (frameCount % 60 === 0) {
    //cria a sprite nuvem
    var nuvem = createSprite(500,random(100,250),20,10);
    nuvem.addImage(imgNuvem);
    nuvem.scale = 0.6;
    nuvem.velocityX = -3;
    
    //atribuir tempo de dura????o ?? vari??vel
    nuvem.lifetime = 170; 
    
    //ajustando a profundidade do trex
    nuvem.depth = trex.depth;
    trex.depth = trex.depth + 2;
    
    //ajustando a profundidade do gameOver
    nuvem.depth = gameOver.depth;
    gameOver.depth = gameOver.depth + 1;
    
    //ajustando a profundidade do reiniciar
    nuvem.depth = reiniciar.depth;
    reiniciar.depth = reiniciar.depth + 1;
        
    //adicionando nuvem ao grupo nuvens
     nuvens.add(nuvem);
  }
}

//cria a fun????o reset
function reset(){
  
  //define o estado do jogo para JOGANDO
  estadoJogo = JOGANDO;
  
  //muda a visibilidade do gameOver/reiniciar
  gameOver.visible = false;
  reiniciar.visible = false;
  
  //destroi o grupo de cactos/nuvens parados na tela
  cactos.destroyEach();
  nuvens.destroyEach();
  
  //muda a imagem do trex 
  trex.changeImage("running",trexParado);
  
  pontuacao = 0;

  //quando vidas for maior que 5, zera a maior pontua????o
  if(vidas < 5){
    vidas++;
  }else{
    vidas = 0;
    maiorPont = 0;
  }
  
}
