import core from '@actions/core';
import github from '@actions/github';
import semver from 'semver';

async function run() {
  try {
    const myToken = process.env.GITHUB_TOKEN;
    const octokit = github.getOctokit(myToken);

    const currentVersion = semver.parse(core.getInput('currentVersion'));
    if (!currentVersion?.version) {
      throw new Error(`Could not parse a version out of the package.json.`);
    }

    const { data: releases } = await octokit.rest.repos.listReleases({
      owner: 'RichardHpa',
      repo: core.getInput('repoName'),
      per_page: 1,
    });

    // this means it could be the first release
    if (releases.length === 0) {
      core.setOutput('isNewerVersion', true);
      core.setOutput('versionType', 'major');
      return;
    }

    const latestVersion = semver.parse(releases[0].tag_name);
    if (!latestVersion?.version) {
      throw new Error(`Could not parse a version from octokit api.`);
    }

    const isNewerVersion = semver.gt(currentVersion.version, latestVersion.version);
    core.setOutput('isNewerVersion', isNewerVersion);

    const versionType = semver.diff(currentVersion.version, latestVersion.version);
    core.setOutput('versionType', versionType);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
