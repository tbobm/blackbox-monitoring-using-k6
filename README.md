# Black-box monitoring using k6

Example repository to highlight black-box monitoring using k6.

Medium article: https://medium.com/@tbobm/black-box-monitoring-at-meero-using-k6-50ff79800cbc

## Configuration

This repository includes an [`envrc.dist`](./envrc.dist) file that mirrors the expected environment
variable configuration expected by the k6 runner to perform requests.

It can be automatically _sourced_ by configuring [`direnv`](https://direnv.net/)
in your shell environment.

To bootstrap your local `.envrc` file used by `direnv`, create a new file based on the
`envrc.dist` template and inject your credentials in it.

```console
$ cp envrc.dist .envrc
$ direnv allow
direnv: loading ~/path/to/repository/.envrc
direnv: export +API_URL
```

## k6 tests

Tests are defined in the [`./k6`](./k6) directory.

`k6` can be installed by following the [installation guide][k6-install] or using [`asdf`][asdf-home] that I very much like:

```console
$ asdf plugin add k6
$ asdf install k6 latest
$ asdf global k6 latest
```

Then, tests can be run using `k6 run k6/<script.js>`

[k6-install]: https://grafana.com/docs/k6/latest/set-up/install-k6/
[asdf-home]: https://asdf-vm.com/


## Example API

### Setup

The API is bootstrapped using `fastapi`. It exposes the minimal working routes and behaviors to have the k6 script working.

The project uses `poetry` and can be run using the following setup:

```console
$ poetry install # install project and dependencies
$ poetry run fastapi dev main.py  # run the API
```

### Routes

Example `curl` commands to try out routes without using k6.

**Login:**
```console
$ curl -d '{"username": "hello", "password": "secret-password"}' -H "Content-Type: application/json" localhost:8000/login
{"message":"authenticated!","token": "valid-mock-token"}
```

**List albums:**
```console
$ curl -H "Authorization: Bearer valid-mock-token" localhost:8000/albums
[{"author":"hello","picture":"https://link-to-cdn.example.com/my-picture.png"},{"author":"hello","picture":"https://link-to-cdn.example.com/my-other-picture.png"}]
```
**Upload media:**
```console
$ curl -XPOST -H "Content-Type: application/json" -H "Authorization: Bearer valid-mock-token" \
  localhost:8000/upload-media -d \
  '{"data": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEUAAACnej3aAAAAAXRSTlMAQObYZgAAAApJREFUCNdjYAAAAAIAAeIhvDMAAAAASUVORK5CYII=", "filetype": "image/png"}'
```
