## dbt Cloud Wait for Run

This action waits for the successful completion of a dbt Cloud Run.  If the run completes with any other status than Success, the action will fail.

### Inputs
  **Required**:
  - `dbt_cloud_account_id` - dbt Cloud Account Id
  - `dbt_cloud_api_key` - dbt Cloud API Key
  - `dbt_cloud_run_id` - dbt Cloud Run Id

  **Optional**:
  - `poll_interval_seconds` - Amount of time between each request to check Run status. [Default=`"30"`]

### Example usage
```yaml
- uses: catchco/dbt-cloud-wait-for-run@latest
  id: dbt_cloud_wait-for-run
  with:
      dbt_cloud_account_id: ${{ secrets.DBT_ACCOUNT_ID }}
      dbt_cloud_api_key: ${{ secrets.DBT_CLOUD_API_KEY }}
      dbt_cloud_run_id: ${{ secrets.DBT_RUN_ID }}
      poll_interval_seconds: 45
```