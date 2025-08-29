# React RSSchool 2025 Project

## Для работы приложения необходим либо локальный файл в папке public, либо данные будут получены по url (вероятно понадобится время)

## For the application to work, either a local file in the public folder is required, or the data will be received via url (this will probably take long time)

## Performance Analysis

### Profiling Results

#### Sorting Performance by name

![Search Ranked Chart](docs/images/profiling/sorting-ranked.png)
![Search Flamegraph Chart](docs/images/profiling/sorting-flamegraph.png)

- **Commit Duration**: 5.8s
- **Render Duration**: 2153.2ms
- **Interactions**: Changed sort order by name
- **Components**: CountriesDisplay, DataFilters, CountryList, ColumnSelector

#### Search Performance

![Search Ranked Chart](docs/images/profiling/search-ranked.png)
![Search Flamegraph Chart](docs/images/profiling/search-flamegraph.png)

- **Commit Duration**: 5.3s
- **Render Duration**: 887.6ms
- **Interactions**: Searchin Germany country
- **Components**: CountriesList
- **Timeline**: 7 commits, slowest: Step 1

#### Choose another year

![Search Ranked Chart](docs/images/profiling/year-ranked.png)
![Search Flamegraph Chart](docs/images/profiling/year-flamegraph.png)
![Search Ranked Chart](docs/images/profiling/year-ranked-2.png)
![Search Flamegraph Chart](docs/images/profiling/year-flamegraph-2.png)

- **Commit Duration**: 3s
- **Render Duration**: 315.5ms
- **Commit Duration-2**: 5.1s
- **Render Duration-2**: 308.6ms
- **Interactions**: Change year
- **Components**: CountriesDisplay, DataFilters, CountryFilters, ColumnSelector
- **Timeline**: 2 commits, slowest: Step 2
