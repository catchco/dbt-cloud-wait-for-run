const axios = require('axios');
const core = require('@actions/core');

const DBT_CLOUD_ACCOUNT_ID = core.getInput('dbt_cloud_account_id');
const DBT_CLOUD_API_KEY = core.getInput('dbt_cloud_api_key');
const DBT_CLOUD_RUN_ID = core.getInput('dbt_cloud_run_id');
const POLL_INTERVAL_SECONDS = core.getInput('poll_interval_seconds');

const dbt_cloud_api = axios.create({
  baseURL: 'https://cloud.getdbt.com/api/v2/',
  timeout: 10000,
  headers: {
    'Authorization': `Token ${DBT_CLOUD_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

const executeAction = async () => {
  try {
    await monitorRun();
  }
  catch(exception){
    core.setFailed(exception);
  }
}

const getRun = async () => {
  const url = `accounts/${DBT_CLOUD_ACCOUNT_ID}/runs/${DBT_CLOUD_RUN_ID}`;

  const response = await dbt_cloud_api.get(url);
  return response.data;
}

const monitorRun = async () => {
  while(true){
    let run = (await getRun()).data;

    if (run.is_complete){
      if (run.status_humanized !== 'Success') {
        core.setFailed(`The run completed with a status of ${run.status_humanized} in ${run.run_duration_humanized}.`);
        break;
      }

      core.info(`The run finished successfully with a duration of ${run.run_duration_humanized}.`)
      break;
    }

    core.info(`The run is still processing.`)
    await sleep(POLL_INTERVAL_SECONDS);
  }
}

const sleep = async (seconds) => {
  core.info(`Sleeping for ${seconds} seconds.`);
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

executeAction();