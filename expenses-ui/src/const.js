const API = {
  "region": "us-east-1",
  "cloudfront": "h2nokn8hva",
};

export const expenses_api = {
  "post": `https://${API.cloudfront}.execute-api.${API.region}.amazonaws.com/Prod/expenses/`
}

