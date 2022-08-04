import { Octokit } from '@octokit/core';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

export default async function handler(req, res) {
  const { q, page } = req.query;
  const result = await octokit.request(`GET /search/repositories?q=${q}&page=${page}`);
  res.status(200).json(result.data);
}
