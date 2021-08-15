// Criando Classe de Despesa

class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) { // Adicionar os parametros recebidos da function 'ano.value, mes.value ...'
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados() { // Ver se todos os dados estão preenchidos corretamente
        for (let i in this) { // this da referencia para a própria despesa criada abaixo
            if (this[i] === undefined || this[i] === '' || this[i] === null) { // Caso seja um dos trÊs, será retornado false
                return false
            }
        }
        return true
    }
}

// Criando a Classe Bd

class Bd {
    // Testando para saber se existe um ID em localStorage
    constructor() {
        let id = localStorage.getItem('id')

        if (id === null) {
            localStorage.setItem('id', 0) // Caso o valor seja null, o ID será 0
        }
    }

    // Identificar o ID
    getProximoID() {
        let proximoId = localStorage.getItem('id') // getItem serve para recuperar um dado dentro do localStorage
        return parseInt(proximoId) + 1
    }

    gravar(d) { // Parametro d = despesa

            let id = this.getProximoID()

            localStorage.setItem(id, JSON.stringify(d)) // Notação JSON

            // Se o valor de gravação for um sucesso
            localStorage.setItem('id', id)

        } //setItem serve para inserir um dado dentro do localStorage

    recuperarTodosRegistros() {

        //Array de despesas

        let despesas = Array()

        let id = localStorage.getItem('id')
            //Recuperando todas as despesas em local Storage
        for (let i = 1; i <= id; i++) {

            //Recuperando a despesa
            let despesa = JSON.parse(localStorage.getItem(i))

            //Pular despesas null
            if (despesa === null) {
                continue
            }

            despesa.id = i // Criando id como novo atributo para que possamos usa-lo para exclui o elemento do StorageWeb
            despesas.push(despesa) // Puxa o array despesas para conter todas as 'despesa'
        }
        return despesas
    }

    pesquisar(despesa) { // Adicionando os dados em array
        let despesasFiltradas = Array()

        despesasFiltradas = this.recuperarTodosRegistros() // Recuperar os dados primeiro para depois filtrar


        // Filtro de ano
        if (despesa.ano != '') { // Verificando se o ano está vazio, se estiver não é possível aplicar o filtro
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
        }
        // Filtro de mes
        if (despesa.mes != '') { // Verificando se o ano está vazio, se estiver não é possível aplicar o filtro
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        }
        // Filtro de dia
        if (despesa.dia != '') { // Verificando se o ano está vazio, se estiver não é possível aplicar o filtro
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        }
        // Filtro de tipo
        if (despesa.tipo != '') { // Verificando se o ano está vazio, se estiver não é possível aplicar o filtro
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }
        // Filtro de descricao
        if (despesa.descricao != '') { // Verificando se o ano está vazio, se estiver não é possível aplicar o filtro
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
        }
        // Filtro de valor
        if (despesa.valor != '') { // Verificando se o ano está vazio, se estiver não é possível aplicar o filtro
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
        }

        // Retornar os dados para quem faz a chamado do método

        return despesasFiltradas
    }

    removerDespesas(id) { // id dos btns que serve para excluir 
        localStorage.removeItem(id)
    }
}

let bd = new Bd()

function cadastrarDespesa() {
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    //console.log(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value) // Testando para ver se está recuperado todos os valores

    // Criando o objeto instanciado nessa function

    let despesa = new Despesa(
            ano.value,
            mes.value,
            dia.value,
            tipo.value,
            descricao.value,
            valor.value
        ) // Adicionando os values como parametros do objeto

    // A validação dos dados precisa ser instaciado antes de gravar
    if (despesa.validarDados()) {
        bd.gravar(despesa) // Criando para gravar no webStorage

        document.getElementById('modal_title').innerHTML = 'Registro inserido'
        document.getElementById('modal_title_cor').className = 'modal-header text-success'
        document.getElementById('modal_description').innerHTML = 'Despesa foi cadastrada com Sucesso!'
        document.getElementById('modal_btn').innerHTML = 'Voltar'
        document.getElementById('modal_btn').className = 'btn btn-success'


        $('#modalRegistraDespesa').modal('show')

        // Limpando campos pós inserção 

        ano.value = ''
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        descricao.value = ''
        valor.value = ''

    } else { // Utilizar jQuery para mostrar o modal
        document.getElementById('modal_title').innerHTML = 'Erro na Inclusão do Registro'
        document.getElementById('modal_title_cor').className = 'modal-header text-danger'
        document.getElementById('modal_description').innerHTML = 'Existem dados obrigatórios que precisam ser Preenchidos!'
        document.getElementById('modal_btn').innerHTML = 'Voltar e Corrigir'
        document.getElementById('modal_btn').className = 'btn btn-danger'

        $('#modalRegistraDespesa').modal('show')
    }

}

function carregarListaDespesas(despesas = Array(), filtro = false) { // Parametro despesas vem da function pesquisarDespesas
    if (despesas.length == 0 && filtro == false) { // Se despesas for igual a 0, mostrar todos os valores, se não for igual a 0, ele não mostra todos os registros, apenas os que estão no parametro despesas
        despesas = bd.recuperarTodosRegistros() // OU SEJA, se pesquisar com os valores vazios, entrará no if e mostrará todos os dados
    } //  SEGUNDO PARAMETRO 'Filtro', caso pesquise algum valor que não exista, não retornará nenhum valor

    // Selecionando o elemento tbody
    let listaDespesas = document.getElementById('listaDespesas')
        // Limpar campos para filtragem
    listaDespesas.innerHTML = ''

    //Percorrer o Array listando os itens

    despesas.forEach(function(d) {

        // Criando a linha(tr)
        let linha = listaDespesas.insertRow()

        //criar as colunas(td)

        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}` // data

        // Ajustando o tipo
        switch (d.tipo) {
            case '1':
                d.tipo = 'Alimentação'
                break
            case '2':
                d.tipo = 'Educação'
                break
            case '3':
                d.tipo = 'Lazer'
                break
            case '4':
                d.tipo = 'Saúde'
                break
            case '5':
                d.tipo = 'Transporte'
                break

        }
        linha.insertCell(1).innerHTML = d.tipo // tipo
        linha.insertCell(2).innerHTML = d.descricao // descrição
        linha.insertCell(3).innerHTML = d.valor // valor

        // Criando o botão de exclusão

        let btn = document.createElement("button")
            // Css do button
        btn.className = 'btn btn-danger'
            // Icon btn
        btn.innerHTML = '<i class="fas fa-times"></i>'
            // Acessando o atributo id do objeto e atribuindo o valor ao btn
        btn.id = `id_despesa_${d.id}`
            // Função onclick
        btn.onclick = function() {
            // remover despesa
            // Criar uma variavel id referente ao this.id para trocar o nome dela, onde id está sendo chamada como id_despesa_[id], portanto trocar esse nick para 'vazio'
            let id = this.id.replace('id_despesa_', '') // replace serve para substituir o nome por outro

            // alert(id) //  ---- Recuperando o nome de cada btn (NÃO EXCLUIR PARA SERVIR DE TESTE DEPOIS) 

            //Metodo para remover
            bd.removerDespesas(id)

            // Atualizar a página após remover

            window.location.reload()
        }
        linha.insertCell(4).append(btn) // InsertCell coloca uma nova coluna e o append faz a inclusão do elemento btn na coluna
    })
}

// Filtrar as despesas
function pesquisarDespesa() { // Responsável por pegar os dados no formulário, criar um novo objeto e passar o objeto para o método pesquisar
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

    let despesas = bd.pesquisar(despesa)

    // Encapsulando as linhas 
    carregarListaDespesas(despesas, true) // Segundo Parametro, filtro = true, ou seja contém valores para filtrar

}