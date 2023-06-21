export function validationCodeMessage(name: string, token: string): string {
    return `
    <div
    style="color:#1c1d1f;margin:0;font-family:'SF Pro Text',-apple-system,BlinkMacSystemFont,Roboto,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:16px;font-weight:400;line-height:1.4">
    <table id="m_3829769411884737291agendaweb-email" width="100%" cellpadding="0" cellspacing="0"
      style="background-color:#f7f9fa;padding:24px">
      <tbody>
        <tr>
          <td>&nbsp;</td>
          <td width="600">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#fff">
              <tbody>
                <tr>
                  <td style="border-bottom:1px solid #cccccc;padding:20px; font-size: 25px;">
                    <strong>Smart Budget</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding:24px 24px 0 24px">
                    <p><a style="text-decoration:none;color:#1c1d1f">
                        Olá, ${name},
                      </a></p>
                    <p>
                      <a style="text-decoration:none;color:#1c1d1f">Agradecemos por testar nosso aplicativo!</a>
                    </p>
                    <p>
                      <a style="text-decoration:none;color:#1c1d1f">Para confirmar sua conta, por favor clique no botão
                        abaixo:</a>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 24px 0 24px">
                    <a href="${process.env.FRONT_URL}/account/confirm?token=${token}"
                      style="border:1px solid #cccccc;display:inline-block; background:#0f42a8" target="_blank">
                      <span
                        style="background:#0f42a8;color:#fff;display:inline-block;min-width:80px;border-top:14px solid #0f42a8;border-bottom:14px solid #0f42a8;border-left:12px solid #0f42a8;border-right:12px solid #0f42a8;text-align:center;text-decoration:none;white-space:nowrap;font-family:'SF Pro Display',-apple-system,BlinkMacSystemFont,Roboto,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:16px;font-weight:700;line-height:1.2;letter-spacing:-0.2px">Confirmar
                        Email</span>
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 24px 0 24px">
                    <p style="margin-bottom:0">
                      <a style="text-decoration:none;color:#1c1d1f;font-size:16px">Lembramos que o link de confirmação é válido por 1
                        hora. Caso não confirme dentro desse período, será necessário realizar o cadastro novamente.</a>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:24px 24px 0 24px">
  
                    <p style="margin-bottom:0;font-size:14px">
                      Se você não realizou o cadastro em nosso site, pedimos que desconsidere este email.
                    </p>
  
                  </td>
                </tr>
                <tr>
                  <td style="padding:35px 24px 0 24px">
                    <p
                      style="font-family:'SF Pro Text',-apple-system,BlinkMacSystemFont,Roboto,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:12px;font-weight:400;line-height:1.4;color:#6a6f73;margin:0">
                      Por favor, não responda a esta mensagem.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px 24px 0 24px">
                    <p
                      style="font-family:'SF Pro Text',-apple-system,BlinkMacSystemFont,Roboto,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:12px;font-weight:400;line-height:1.4;color:#6a6f73;margin:0">
                      Atenciosamente,
                    </p>
                    <p
                      style="font-family:'SF Pro Text',-apple-system,BlinkMacSystemFont,Roboto,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:12px;font-weight:400;line-height:1.4;color:#6a6f73;margin:0">
                      devLopesRenato
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:24px 0 0 0"></td>
                </tr>
              </tbody>
            </table>
          </td>
          <td>&nbsp;</td>
        </tr>
      </tbody>
    </table>
    </div>
`
}