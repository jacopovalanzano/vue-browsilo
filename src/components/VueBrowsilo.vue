<template>
    <!-- Author: Jacopo Valanzano jacopo.valanzano.com -->
    <!-- https://github.com/jacopovalanzano/vue-browsilo -->
    <!-- License: MIT https://opensource.org/licenses/MIT -->
    <main>
        <div class="browsilo-container">
            <div class="browsilo-aligner">
                <div class="txtc">
                    <!-- Page title -->
                    <h1 class="browsilo-page-title">{{ Title }}</h1>
                </div>
                <div class="browsilo-header">
                    <div class="browsilo-box-path">
                        <!-- Basepath "/" -->
                        <span style="padding: 0 3px;">/</span>
                        <div v-bind:key="PathKey" v-for="(Path, PathKey) in retrievePath()">
                            <!-- Project path -->
                            <a href="#"
                               class="browsilo-path-element"
                               @click.stop="browseDirectory(Path.url)"
                            >{{ Path.name }}</a>
                            <span style="padding: 0 3px;">/</span>
                        </div>
                    </div>
                    <!-- Project title -->
                    <h2 class="browsilo-project-title">{{ ProjectTitle }}</h2>
                </div>
                <div class="browsilo-box">
                    <div class="browsilo-box-titles">
                        <!-- Files and folders count. -->
                        <span>{{ getNumberOfFiles() }} files, {{ getNumberOfFolders() }} folders</span>
                    </div>
                    <!-- The files and directories listed by the file browser. -->
                    <table class="browsilo-table">
                        <thead class="browsilo-table-head">
                        <tr>
                            <th>
                                <div class="browsilo-table-head-element-hidden">Icon</div>
                            </th>
                            <th>
                                <div class="browsilo-table-head-element-hidden">Name</div>
                            </th>
                            <th>
                                <div class="browsilo-table-head-element-hidden">Size</div>
                            </th>
                            <th>
                                <div class="browsilo-table-head-element-hidden">Content Type</div>
                            </th>
                        </tr>
                        </thead>
                        <tbody class="browsilo-table-body">
                        <tr>
                            <td class="browsilo-grid-element" style="width:1em;height: 1em;">
                                <!-- Left empty -->
                            </td>
                            <td class="browsilo-left-couple-column">
                                <!-- Go to parent directory ".." -->
                                <a title="Parent directory"
                                   id="browsilo-parent-button"
                                   @click.stop="enterDirectory('..')"
                                   href="#">..</a>
                            </td>
                            <td class="browsilo-left-couple-column">
                                <!-- Left empty -->
                            </td>
                            <td class="browsilo-rightmost-column">
                                <!-- Left empty -->
                            </td>
                        </tr>

                        <!-- Renders each file and directory listed in the Inodes object: -->
                        <tr v-for="(Inode, InodeKey) in Inodes" v-bind:key="InodeKey" class="browsilo-data-tr">
                            <td class="browsilo-leftmost-column">
                                <div v-if="Inode.fileType === 'dir'">
                                    <!-- Directory image -->
                                    <svg class="css-i6dzq1" fill="currentColor" height="1em" stroke="currentColor"
                                         stroke-width="0" viewBox="0 0 14 16" width="1em"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M13 4H7V3c0-.66-.31-1-1-1H1c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V5c0-.55-.45-1-1-1zM6 4H1V3h5v1z"
                                            fill-rule="evenodd"></path>
                                    </svg>
                                </div>
                                <div v-if="Inode.fileType === 'file'">
                                    <!-- File image -->
                                    <svg class="css-i6dzq1" fill="currentColor" height="1em" stroke="currentColor"
                                         stroke-width="0" viewBox="0 0 12 16" width="1em"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M8.5 1H1c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h10c.55 0 1-.45 1-1V4.5L8.5 1zM11 14H1V2h7l3 3v9zM5 6.98L3.5 8.5 5 10l-.5 1L2 8.5 4.5 6l.5.98zM7.5 6L10 8.5 7.5 11l-.5-.98L8.5 8.5 7 7l.5-1z"
                                            fill-rule="evenodd"></path>
                                    </svg>
                                </div>
                            </td>

                            <!-- If the "inode" is a directory: -->
                            <td v-if="Inode.fileType === 'dir'" class="browsilo-left-couple-column">
                                <a class="browsilo-inode-link"
                                   id="browsilo-file-inode"
                                   @click.stop="enterDirectory(Inode.fileName)"
                                   href="#"
                                   v-bind:title="Inode.fileName">{{ Inode.fileName }}</a>
                            </td>

                            <td v-if="Inode.fileType === 'file'" class="browsilo-left-couple-column">
                                <!-- Or if the inode is a file: -->
                                <a class="browsilo-inode-link"
                                   id="browsilo-file-inode"
                                   v-bind:href="['/' + ProjectPath.join('/') + '/' + Inode.fileName]"
                                   v-bind:title="Inode.fileName">{{ Inode.fileName }}</a>
                            </td>

                            <!-- The file size -->
                            <td class="browsilo-left-couple-column">{{ Inode.fileSize }}</td>
                            <!-- The file content type -->
                            <td class="browsilo-rightmost-column">{{ Inode.fileContentType }}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
export default {
    name: 'VueBrowsilo',
    data () {
        return {
            // The main title.
            Title: '',
            // The title of the project being browsed.
            ProjectTitle: '',
            // 'ProjectPath' is the project URL split in an indexed array.
            // When the 'ProjectPath' changes, the 'Inodes' object defined below is updated by the ProjectPath watcher.
            ProjectPath: [],
            // The 'Inodes' is an array of objects. It must be updated with an API call.
            Inodes: []
        }
    },
    methods: {
        /**
         * A proof of concept. Replace it with your API call.
         *
         * @param projectUrl string
         */
        YOUR_SUPER_DUPER_API_CALL (projectUrl) {
            switch (projectUrl) {
                default:
                    return new Promise((resolve) => {
                        return resolve([
                            {
                                fileType: 'dir',
                                fileContentType: '-',
                                fileSize: '-',
                                fileName: 'empty'
                            }
                        ]);
                    })
            }
        },

        /**
         * By reassigning the 'Inodes' object with the new fetched data,
         * 'updateInodes' updates the VueBrowsilo view.
         */
        updateInodes (data) {
            this.Inodes = data
        },

        /**
         * Browse the selected project directory.
         * 'browseDirectory' updates the 'ProjectPath' object, which then updates the VueBrowsilo view through
         * a Vue "watcher".
         */
        browseDirectory (name) {
            this.ProjectPath = name.split('/').filter(e => e)
        },

        /**
         * Browse the selected project directory.
         */
        enterDirectory (name) {
            // Goes back
            if (name === '..') {

                // Prevent undefined (only useful for unit tests)
                if(this.ProjectPath.length <= 0) {
                    return
                }

                this.ProjectPath.pop()
                // If we are trying to access the same path, do nothing.
            } else if (name === '.') {
                // Left empty!
            } else {
                // Enters a directory
                this.ProjectPath.push(name)
            }
        },

        /**
         * Returns the number of files present in the current directory.
         */
        getNumberOfFiles () {
            return this.Inodes.filter((e) => {
                if (e.fileType === 'file') {
                    return 1
                }
            }).length
        },

        /**
         * Returns the number of directories of the current directory.
         */
        getNumberOfFolders () {
            return this.Inodes.filter((e) => {
                if (e.fileType === 'dir') {
                    return 1
                }
            }).length
        },

        /**
         * Returns an indexed array of the Project path split by dash.
         *
         * @returns {*[]}
         */
        retrievePath () {
            // let hostname = window.location.hostname
            let pathSplit = this.ProjectPath
            let newPath = []
            let loopPath = []
            for (let i in pathSplit) {
                loopPath += pathSplit[i] + '/'
                newPath.push({
                    name: pathSplit[i],
                    // Prepend with dash (absolute path).
                    url: '/' + loopPath
                })
            }
            return newPath
        }
    },

    /**
     * Once the VueBrowsilo component is mounted, update the file browser, or it will appear empty.
     */
    async mounted() {
        let _this = this

        // Prevent undefined (only useful for unit tests)
        if(this.ProjectPath.length <= 0) {
            return
        }

        await this.YOUR_SUPER_DUPER_API_CALL()
            .then((data) => {
                _this.updateInodes(data)
            })
    },

    /**
     * Everytime the 'ProjectPath' object is reassigned the VueBrowsilo view gets updated.
     */
    watch: {
        // When 'ProjectPath' is updated:
        ProjectPath: function () {
            // Clone 'this'
            let _this = this

            // Prevent undefined (only useful for unit tests)
            if(this.ProjectPath.length <= 0) {
                return
            }

            // Your API call. 'YOUR_SUPER_DUPER_API_CALL' is just a "proof of concept" to get you started.
            // You should replace 'YOUR_SUPER_DUPER_API_CALL' with your own function.
            this.YOUR_SUPER_DUPER_API_CALL() // Your API call!
                .then((data) => {
                    // The 'updateInodes' translates the JSON response for the file browser.
                    _this.updateInodes(data)
                })
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.browsilo-container {
    width: 100%;
    font-family: Helvetica;
}

.browsilo-aligner {
    max-width: 940px;
    margin-left: auto;
    margin-right: auto;
}

.browsilo-box {
    width: 100%;
    height: min-content;
    text-align: left;
    direction: ltr;
    margin-left: auto;
    margin-right: auto;
    max-width: 940px;
    border: 1px #eae9e9 solid;
    border-radius: 3px;
    box-sizing: inherit;
}

.browsilo-table {
    font-size: medium;
    line-height: 1.5;
    width: 100%;
}

.browsilo-table-body {
    /* left empty */
}

.browsilo-rightmost-column {
    text-align: right;
    padding: 5px 10px 5px 0px;
}

.browsilo-leftmost-column {
    padding: 5px 0px 5px 10px;
    width: 30px;
}

.browsilo-left-couple-column {
    padding: 5px 0px 5px 0px;
    word-break: break-word;
}

.browsilo-box-titles {
    font-size: medium;
    border-bottom: 1px #eae9e1 solid;
    padding: 10px;
    background: #f2f3f9;
}

.browsilo-box-path {
    display: inline-flex;
}

.browsilo-header {
    width: 100%;
    display: inline-flex;
    justify-content: space-between;
    font-size: x-large;
    margin: 10px 0;
}

.browsilo-table-head-element-hidden {
    border: 0;
    clip: rect(0 0 0 0);
    height: 1px;
    width: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    position: absolute;
}

.browsilo-inode-link {
    text-decoration: none;
}
</style>
