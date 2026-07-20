CREATE SCHEMA IF NOT EXISTS `BrechoOnline` DEFAULT CHARACTER SET utf8 ;
USE `BrechoOnline` ;

-- -----------------------------------------------------
-- Table `BrechoOnline`.`Usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `BrechoOnline`.`Usuario` (
  `ID_Usuario` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(50) NULL,
  `sobrenome` VARCHAR(50) NULL,
  `email` VARCHAR(100) NULL,
  `telefone` VARCHAR(15) NULL,
  `cpf` VARCHAR(14) NULL,
  `senha` VARCHAR(255) NULL,
  `data_cadastro` DATETIME NULL,
  `status_conta` ENUM('Ativo', 'inativo', 'suspenso') NULL,
  PRIMARY KEY (`ID_Usuario`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
  UNIQUE INDEX `cpf_UNIQUE` (`cpf` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `BrechoOnline`.`Categoria`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `BrechoOnline`.`Categoria` (
  `ID_categoria` INT NOT NULL AUTO_INCREMENT,
  `nome_categoria` VARCHAR(50) NULL,
  `descricao` TEXT NULL,
  PRIMARY KEY (`ID_categoria`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `BrechoOnline`.`Vendedor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `BrechoOnline`.`Vendedor` (
  `ID_vendedor` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(50) NULL,
  `sobrenome` VARCHAR(50) NULL,
  `email` VARCHAR(100) NULL,
  `telefone` VARCHAR(15) NULL,
  `cnpj` VARCHAR(14) NULL,
  `senha` VARCHAR(255) NULL,
  `data_cadastro` DATETIME NULL,
  `status_conta` ENUM('Ativo', 'inativo', 'suspenso') NULL,
  PRIMARY KEY (`ID_vendedor`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
  UNIQUE INDEX `cpf_UNIQUE` (`cnpj` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `BrechoOnline`.`Produto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `BrechoOnline`.`Produto` (
  `ID_produto` INT NOT NULL AUTO_INCREMENT,
  `ID_categoria` INT NOT NULL,
  `ID_vendedor` INT NOT NULL,
  `nome` VARCHAR(100) NULL,
  `descricao` TEXT NULL,
  `preco` DECIMAL(10,2) NULL,
  `tamanho` ENUM('PP', 'P', 'M', 'G', 'GG', 'XG', '36', '38', '40', '42', '44', '46') NULL,
  `estado_conservacao` ENUM('Novo com etiqueta', 'Sem uso', 'Pouco usado', 'Usado', 'Bem usado') NULL,
  `marca` VARCHAR(50) NULL,
  `cor` VARCHAR(30) NULL,
  `data_publicacao` DATETIME NULL,
  `status` ENUM('Disponivel', 'Reservado', 'Vendido', 'Oculto') NULL,
  PRIMARY KEY (`ID_produto`),
  INDEX `fk_Produto_Categoria1_idx` (`ID_categoria` ASC) VISIBLE,
  INDEX `fk_Produto_Vendedor1_idx` (`ID_vendedor` ASC) VISIBLE,
  CONSTRAINT `fk_Produto_Categoria1`
    FOREIGN KEY (`ID_categoria`)
    REFERENCES `BrechoOnline`.`Categoria` (`ID_categoria`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Produto_Vendedor1`
    FOREIGN KEY (`ID_vendedor`)
    REFERENCES `BrechoOnline`.`Vendedor` (`ID_vendedor`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `BrechoOnline`.`ImagemProduto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `BrechoOnline`.`ImagemProduto` (
  `ID_imagem` INT NOT NULL AUTO_INCREMENT,
  `url_imagem` VARCHAR(500) NULL,
  `principal` TINYINT NULL,
  PRIMARY KEY (`ID_imagem`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `BrechoOnline`.`Carrinho`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `BrechoOnline`.`Carrinho` (
  `ID_carrinho` INT NOT NULL AUTO_INCREMENT,
  `ID_Usuario` INT NOT NULL,
  `data_criacao` DATETIME NULL,
  PRIMARY KEY (`ID_carrinho`),
  INDEX `fk_Carrinho_Usuario1_idx` (`ID_Usuario` ASC) VISIBLE,
  CONSTRAINT `fk_Carrinho_Usuario1`
    FOREIGN KEY (`ID_Usuario`)
    REFERENCES `BrechoOnline`.`Usuario` (`ID_Usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `BrechoOnline`.`Pedido`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `BrechoOnline`.`Pedido` (
  `ID_pedido` INT NOT NULL AUTO_INCREMENT,
  `ID_usuario` INT NOT NULL,
  `ID_carrinho` INT NOT NULL,
  `ID_vendedor` INT NOT NULL,
  `data_pedido` DATETIME NULL,
  `valor_total` DECIMAL(10,2) NULL,
  `status` ENUM('Pendente', 'Pago', 'Enviado', 'Entregue', 'Cancelado') NULL,
  PRIMARY KEY (`ID_pedido`),
  INDEX `fk_Pedido_Usuario_idx` (`ID_usuario` ASC) VISIBLE,
  INDEX `fk_Pedido_Carrinho1_idx` (`ID_carrinho` ASC) VISIBLE,
  INDEX `fk_Pedido_Vendedor1_idx` (`ID_vendedor` ASC) VISIBLE,
  CONSTRAINT `fk_Pedido_Usuario`
    FOREIGN KEY (`ID_usuario`)
    REFERENCES `BrechoOnline`.`Usuario` (`ID_Usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Pedido_Carrinho1`
    FOREIGN KEY (`ID_carrinho`)
    REFERENCES `BrechoOnline`.`Carrinho` (`ID_carrinho`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Pedido_Vendedor1`
    FOREIGN KEY (`ID_vendedor`)
    REFERENCES `BrechoOnline`.`Vendedor` (`ID_vendedor`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `BrechoOnline`.`Pagamento`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `BrechoOnline`.`Pagamento` (
  `ID_pagamento` INT NOT NULL AUTO_INCREMENT,
  `ID_pedido` INT NOT NULL,
  `metodo_pagamento` ENUM('PIX', 'Cartão', 'Boleto') NULL,
  `valor` DECIMAL(10,2) NULL,
  `data_pagamento` DATETIME NULL,
  `status` ENUM('Pendente', 'Aprovado', 'Recusado') NULL,
  PRIMARY KEY (`ID_pagamento`),
  INDEX `fk_Pagamento_Pedido1_idx` (`ID_pedido` ASC) VISIBLE,
  CONSTRAINT `fk_Pagamento_Pedido1`
    FOREIGN KEY (`ID_pedido`)
    REFERENCES `BrechoOnline`.`Pedido` (`ID_pedido`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `BrechoOnline`.`AvaliacaoVendedor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `BrechoOnline`.`AvaliacaoVendedor` (
  `ID_avaliacao` INT NOT NULL AUTO_INCREMENT,
  `ID_comprador` INT NOT NULL,
  `ID_vendedor` INT NOT NULL,
  `nota` TINYINT NULL,
  `comentario` TEXT NULL,
  `data` DATETIME NULL,
  PRIMARY KEY (`ID_avaliacao`),
  INDEX `fk_AvaliacaoVendedor_Vendedor1_idx` (`ID_vendedor` ASC) VISIBLE,
  INDEX `fk_AvaliacaoVendedor_Usuario1_idx` (`ID_comprador` ASC) VISIBLE,
  CONSTRAINT `fk_AvaliacaoVendedor_Vendedor1`
    FOREIGN KEY (`ID_vendedor`)
    REFERENCES `BrechoOnline`.`Vendedor` (`ID_vendedor`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_AvaliacaoVendedor_Usuario1`
    FOREIGN KEY (`ID_comprador`)
    REFERENCES `BrechoOnline`.`Usuario` (`ID_Usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `BrechoOnline`.`AvaliacaoProduto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `BrechoOnline`.`AvaliacaoProduto` (
  `ID_avaliacao_produto` INT NOT NULL AUTO_INCREMENT,
  `ID_produto` INT NOT NULL,
  `ID_Usuario` INT NOT NULL,
  `nota` TINYINT NULL,
  `comentario` TEXT NULL,
  PRIMARY KEY (`ID_avaliacao_produto`),
  INDEX `fk_AvaliacaoProduto_Produto1_idx` (`ID_produto` ASC) VISIBLE,
  INDEX `fk_AvaliacaoProduto_Usuario1_idx` (`ID_Usuario` ASC) VISIBLE,
  CONSTRAINT `fk_AvaliacaoProduto_Produto1`
    FOREIGN KEY (`ID_produto`)
    REFERENCES `BrechoOnline`.`Produto` (`ID_produto`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_AvaliacaoProduto_Usuario1`
    FOREIGN KEY (`ID_Usuario`)
    REFERENCES `BrechoOnline`.`Usuario` (`ID_Usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `BrechoOnline`.`Denuncia`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `BrechoOnline`.`Denuncia` (
  `ID_denuncia` INT NOT NULL AUTO_INCREMENT,
  `ID_Usuario` INT NOT NULL,
  `ID_produto` INT NOT NULL,
  `motivo` VARCHAR(200) NULL,
  `descricao_produto` TEXT NULL,
  `status` ENUM('Aberta', 'Em análise', 'Resolvida') NULL,
  PRIMARY KEY (`ID_denuncia`),
  INDEX `fk_Denuncia_Produto1_idx` (`ID_produto` ASC) VISIBLE,
  INDEX `fk_Denuncia_Usuario1_idx` (`ID_Usuario` ASC) VISIBLE,
  CONSTRAINT `fk_Denuncia_Produto1`
    FOREIGN KEY (`ID_produto`)
    REFERENCES `BrechoOnline`.`Produto` (`ID_produto`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Denuncia_Usuario1`
    FOREIGN KEY (`ID_Usuario`)
    REFERENCES `BrechoOnline`.`Usuario` (`ID_Usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `BrechoOnline`.`Comissao`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `BrechoOnline`.`Comissao` (
  `ID_comissao` INT NOT NULL AUTO_INCREMENT,
  `ID_pedido` INT NULL,
  `ID_vendedor` INT NOT NULL,
  `percentual` DECIMAL(5,2) NULL,
  PRIMARY KEY (`ID_comissao`),
  INDEX `fk_Comissao_Vendedor1_idx` (`ID_vendedor` ASC) VISIBLE,
  CONSTRAINT `fk_Comissao_Vendedor1`
    FOREIGN KEY (`ID_vendedor`)
    REFERENCES `BrechoOnline`.`Vendedor` (`ID_vendedor`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `BrechoOnline`.`Favoritos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `BrechoOnline`.`Favoritos` (
  `ID_usuario` INT NOT NULL,
  `ID_produto` INT NOT NULL,
  `ID_favorito` INT NOT NULL,
  `status` TINYINT NULL,
  PRIMARY KEY (`ID_favorito`, `ID_usuario`, `ID_produto`),
  INDEX `fk_Favoritos_Usuario1_idx` (`ID_usuario` ASC) VISIBLE,
  INDEX `fk_Favoritos_Produto1_idx` (`ID_produto` ASC) VISIBLE,
  CONSTRAINT `fk_Favoritos_Usuario1`
    FOREIGN KEY (`ID_usuario`)
    REFERENCES `BrechoOnline`.`Usuario` (`ID_Usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Favoritos_Produto1`
    FOREIGN KEY (`ID_produto`)
    REFERENCES `BrechoOnline`.`Produto` (`ID_produto`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `BrechoOnline`.`Endereco`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `BrechoOnline`.`Endereco` (
  `ID_endereco` INT NOT NULL AUTO_INCREMENT,
  `ID_usuario` INT NOT NULL,
  `logradouro` VARCHAR(200) NULL,
  `numero` VARCHAR(10) NULL,
  `complemento` VARCHAR(100) NOT NULL,
  `bairro` VARCHAR(100) NULL,
  `cidade` VARCHAR(100) NULL,
  `estado` VARCHAR(2) NULL,
  `cep` VARCHAR(9) NULL,
  `tipo` ENUM('Entrega', 'Cobrança', 'Ambos') NULL,
  PRIMARY KEY (`ID_endereco`),
  INDEX `fk_Endereco_Usuario1_idx` (`ID_usuario` ASC) VISIBLE,
  CONSTRAINT `fk_Endereco_Usuario1`
    FOREIGN KEY (`ID_usuario`)
    REFERENCES `BrechoOnline`.`Usuario` (`ID_Usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `BrechoOnline`.`Entrega`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `BrechoOnline`.`Entrega` (
  `ID_entrega` INT NOT NULL,
  `ID_pedido` INT NOT NULL,
  `ID_endereco` INT NOT NULL,
  `transportadora` VARCHAR(100) NULL,
  `codigo_rastreio` VARCHAR(100) NOT NULL,
  `data_envio` DATETIME NOT NULL,
  `data_entrega_prevista` DATETIME NOT NULL,
  `data_entrega_realizada` DATETIME NOT NULL,
  `status` ENUM('Aguardando', 'Em Trânsito', 'Entregue', 'Devolvido') NULL,
  PRIMARY KEY (`ID_entrega`),
  INDEX `fk_Entrega_Pedido1_idx` (`ID_pedido` ASC) VISIBLE,
  INDEX `fk_Entrega_Endereco1_idx` (`ID_endereco` ASC) VISIBLE,
  CONSTRAINT `fk_Entrega_Pedido1`
    FOREIGN KEY (`ID_pedido`)
    REFERENCES `BrechoOnline`.`Pedido` (`ID_pedido`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Entrega_Endereco1`
    FOREIGN KEY (`ID_endereco`)
    REFERENCES `BrechoOnline`.`Endereco` (`ID_endereco`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `BrechoOnline`.`Mensagem`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `BrechoOnline`.`Mensagem` (
  `ID_mensagem` INT NOT NULL,
  `ID_produto` INT NOT NULL,
  `conteudo` TEXT NOT NULL,
  `data_envio` DATETIME NULL,
  `lida` TINYINT NULL,
  PRIMARY KEY (`ID_mensagem`),
  INDEX `fk_Mensagem_Produto1_idx` (`ID_produto` ASC) VISIBLE,
  CONSTRAINT `fk_Mensagem_Produto1`
    FOREIGN KEY (`ID_produto`)
    REFERENCES `BrechoOnline`.`Produto` (`ID_produto`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `BrechoOnline`.`ItemCarrinho`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `BrechoOnline`.`ItemCarrinho` (
  `ID_item` INT NOT NULL,
  `ID_carrinho` INT NOT NULL,
  `ID_produto` INT NOT NULL,
  `quantidade` INT NULL,
  `valor_total` DECIMAL(10,2) NULL,
  PRIMARY KEY (`ID_item`),
  INDEX `fk_ItemCarrinho_Carrinho1_idx` (`ID_carrinho` ASC) VISIBLE,
  INDEX `fk_ItemCarrinho_Produto1_idx` (`ID_produto` ASC) VISIBLE,
  CONSTRAINT `fk_ItemCarrinho_Carrinho1`
    FOREIGN KEY (`ID_carrinho`)
    REFERENCES `BrechoOnline`.`Carrinho` (`ID_carrinho`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_ItemCarrinho_Produto1`
    FOREIGN KEY (`ID_produto`)
    REFERENCES `BrechoOnline`.`Produto` (`ID_produto`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `BrechoOnline`.`Produto_has_ImagemProduto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `BrechoOnline`.`Produto_has_ImagemProduto` (
  `Produto_ID_produto` INT NOT NULL,
  `ImagemProduto_ID_imagem` INT NOT NULL,
  PRIMARY KEY (`Produto_ID_produto`, `ImagemProduto_ID_imagem`),
  INDEX `fk_Produto_has_ImagemProduto_ImagemProduto1_idx` (`ImagemProduto_ID_imagem` ASC) VISIBLE,
  INDEX `fk_Produto_has_ImagemProduto_Produto1_idx` (`Produto_ID_produto` ASC) VISIBLE,
  CONSTRAINT `fk_Produto_has_ImagemProduto_Produto1`
    FOREIGN KEY (`Produto_ID_produto`)
    REFERENCES `BrechoOnline`.`Produto` (`ID_produto`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Produto_has_ImagemProduto_ImagemProduto1`
    FOREIGN KEY (`ImagemProduto_ID_imagem`)
    REFERENCES `BrechoOnline`.`ImagemProduto` (`ID_imagem`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `BrechoOnline`.`Mensagem_has_Usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `BrechoOnline`.`Mensagem_has_Usuario` (
  `Mensagem_ID_mensagem` INT NOT NULL,
  `Usuario_ID_Usuario` INT NOT NULL,
  PRIMARY KEY (`Mensagem_ID_mensagem`, `Usuario_ID_Usuario`),
  INDEX `fk_Mensagem_has_Usuario_Usuario1_idx` (`Usuario_ID_Usuario` ASC) VISIBLE,
  INDEX `fk_Mensagem_has_Usuario_Mensagem1_idx` (`Mensagem_ID_mensagem` ASC) VISIBLE,
  CONSTRAINT `fk_Mensagem_has_Usuario_Mensagem1`
    FOREIGN KEY (`Mensagem_ID_mensagem`)
    REFERENCES `BrechoOnline`.`Mensagem` (`ID_mensagem`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Mensagem_has_Usuario_Usuario1`
    FOREIGN KEY (`Usuario_ID_Usuario`)
    REFERENCES `BrechoOnline`.`Usuario` (`ID_Usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
