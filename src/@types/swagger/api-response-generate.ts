export const ApiResponseGenerate = (statusCode: 400 | 401 | 404 | 409, message: string | string[]) => {

    const statusInfo: { title: string, description: string } =
        statusCode === 400
            ? { title: "Bad Request", description: 'Requisição inválida. Verifique se os dados foram fornecidos corretamente.' }
            : statusCode === 401
                ? { title: "Unauthorized", description: 'Não autorizado.' }
                : statusCode === 404
                    ? { title: "Not Found", description: 'Item não encontrado.' }
                    : statusCode === 409
                        ? { title: "Conflict", description: 'O item já existe.' }
                        : { title: "", description: '' }

    return {
        description: statusInfo.description,
        schema: {
            example: {
                statusCode,
                message,
                error: statusInfo.title
            }
        }
    }
}