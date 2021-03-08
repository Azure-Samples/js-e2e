    // get mongoose SDK
    const mongoose = require("mongoose");

    const run = async () => {
      // connect to mongoose
      await mongoose.connect(
        "YOUR-CONNECTION-STRING",
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useFindAndModify: false,
          useCreateIndex: true,
        }
      );

      // define a schema
      const Schema = mongoose.Schema;
      const ObjectId = Schema.ObjectId;

      const JobSchema = new Schema({
        id: ObjectId,
        name: String,
        job: String,
      });

      // Create model for database collection `Job`
      const JobModel = mongoose.model("Job", JobSchema);

      // Add data to doc and save
      const doc1 = new JobModel();
      doc1.name = "Joan Smith";
      doc1.job = "Developer";
      await doc1.save();

      const doc2 = new JobModel();
      doc2.name = "Bob Jones";
      doc2.job = "Quality Assurance";
      await doc2.save();

      const doc3 = new JobModel();
      doc3.name = "Michelle Roberts";
      doc3.job = "Program Manager";
      await doc3.save();

      // find all docs in collection
      console.log("find all");
      const jobs = await JobModel.find({});

      //iterate over docs
      for (var job of jobs) {
        console.log(`loop ` + JSON.stringify(job));
      }

      // close connection
      mongoose.connection.close();

      return "succeeded";
    };

    run()
    .then((result) => {
        console.log(result);
    })
    .catch((err) => {
        console.log(err);
    });
