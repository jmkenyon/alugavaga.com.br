export default function ExcluirContaPage() {
  return (
    <div className="p-20 justify-center flex-col max-w-3xl mx-auto">
      <h1 className="font-bold mb-8 text-center text-xl">Excluir Conta</h1>
      <p>Para excluir sua conta no Aluga Vaga:</p>
      <ol>
        <li>Abra o app Aluga Vaga</li>
        <li>
          Acesse <strong>Perfil → Excluir Conta</strong>
        </li>
        <li>Confirme a exclusão. Todos os dados associados serão removidos.</li>
      </ol>
      <div className="flex flex-row items-center mt-4 gap-1">
        <p>Se tiver problemas, contate nosso suporte:</p>
        <a
          href="mailto:oi@alugavaga.com.br"
          className="text-[#076951] underline"
        >
          oi@alugavaga.com.br
        </a>
      </div>
    </div>
  );
}
